import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Session } from "next-auth";

// Mock des dépendances.
vi.mock("server-only", () => ({}));

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
}));

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCurrentUser, requireUser, requireAdmin } from "./permissions";

// Type local limité aux besoins de ces tests.
// On évite ainsi les signatures multiples d'Auth.js v5.
type MockSession = Session | null;
const mockedAuth = auth as unknown as () => Promise<MockSession>;

const userSession = {
  expires: "2099-01-01T00:00:00.000Z",
  user: {
    id: "user-1",
    name: "Utilisateur test",
    email: "user@test.local",
    role: "USER",
  },
} satisfies Session;

const adminSession = {
  expires: "2099-01-01T00:00:00.000Z",
  user: {
    id: "admin-1",
    name: "Administrateur test",
    email: "admin@test.local",
    role: "ADMIN",
  },
} satisfies Session;

describe("Permissions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(mockedAuth).mockResolvedValue(null);
  });

  describe("getCurrentUser", () => {
    it("renvoie null si personne n'est connecté", async () => {
      expect(await getCurrentUser()).toBeNull();
    });

    it("renvoie l'utilisateur connecté", async () => {
      vi.mocked(mockedAuth).mockResolvedValue(userSession);

      const user = await getCurrentUser();

      expect(user?.role).toBe("USER");
      expect(user?.id).toBe("user-1");
    });
  });

  describe("requireUser", () => {
    it("redirige vers login si personne n'est connecté", async () => {
      await expect(requireUser()).rejects.toThrow("NEXT_REDIRECT:/login");
      expect(redirect).toHaveBeenCalledWith("/login");
    });

    it("autorise un utilisateur connecté", async () => {
      vi.mocked(mockedAuth).mockResolvedValue(userSession);

      const user = await requireUser();

      expect(user.role).toBe("USER");
    });
  });

  describe("requireAdmin", () => {
    it("redirige vers login si personne n'est connecté", async () => {
      await expect(requireAdmin()).rejects.toThrow("NEXT_REDIRECT:/login");
    });

    it("refuse l'accès à un utilisateur standard", async () => {
      vi.mocked(mockedAuth).mockResolvedValue(userSession);

      await expect(requireAdmin()).rejects.toThrow("NEXT_REDIRECT:/");
      expect(redirect).toHaveBeenCalledWith("/");
    });

    it("autorise un administrateur", async () => {
      vi.mocked(mockedAuth).mockResolvedValue(adminSession);

      const admin = await requireAdmin();

      expect(admin.role).toBe("ADMIN");
      expect(admin.id).toBe("admin-1");
    });
  });
});
