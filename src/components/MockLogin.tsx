import { useState, useEffect } from "react";
import { toast } from "sonner";

interface User {
  name: string;
  email: string;
  role: "agent" | "user" | "admin";
  verified: boolean;
  verificationStatus: "none" | "pending" | "approved" | "rejected";
}

const INITIAL_MOCK_USERS: Record<string, User & { password: string }> = {
  "admin@inmolink.com": {
    name: "Administrador",
    email: "admin@inmolink.com",
    password: "admin123",
    role: "admin",
    verified: true,
    verificationStatus: "approved",
  },
  "agent@inmolink.com": {
    name: "Agente Profesional",
    email: "agent@inmolink.com",
    password: "agent123",
    role: "agent",
    verified: true,
    verificationStatus: "approved",
  },
  "buyer@inmolink.com": {
    name: "Comprador Demo",
    email: "buyer@inmolink.com",
    password: "buyer123",
    role: "user",
    verified: true,
    verificationStatus: "none",
  },
};

export function MockLogin({ onLogin }: { onLogin: (user: User) => void }) {
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"agent" | "user">("user");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Get users from localStorage or use initial ones
  const getStoredUsers = (): Record<string, User & { password: string }> => {
    const stored = localStorage.getItem("inmolink_mock_db");
    if (stored) {
      return { ...INITIAL_MOCK_USERS, ...JSON.parse(stored) };
    }
    return INITIAL_MOCK_USERS;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1000));

    const users = getStoredUsers();

    if (mode === "signIn") {
      const user = users[email];
      if (user && user.password === password) {
        toast.success(`Bienvenido de nuevo, ${user.name}`);
        onLogin({
          name: user.name,
          email: user.email,
          role: user.role,
          verified: user.verified,
          verificationStatus: user.verificationStatus,
        });
      } else {
        toast.error("Credenciales no válidas.");
        setIsLoading(false);
      }
    } else {
      // Sign Up Logic
      if (users[email]) {
        toast.error("El correo ya está registrado.");
        setIsLoading(false);
        return;
      }

      const newUser: User & { password: string } = {
        name,
        email,
        password,
        role,
        verified: role === "user", // Buyers verified by default, agents NOT
        verificationStatus: role === "agent" ? "pending" : "approved",
      };

      const customUsers = JSON.parse(localStorage.getItem("inmolink_mock_db") || "{}");
      customUsers[email] = newUser;
      localStorage.setItem("inmolink_mock_db", JSON.stringify(customUsers));

      if (role === "agent") {
        toast.info("Cuenta de Agente creada. Requiere verificación de un administrador.");
      } else {
        toast.success("Cuenta creada exitosamente. Ya puede iniciar sesión.");
      }
      
      setMode("signIn");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-blue-950 px-4 transition-all duration-500 py-12">
      <div className="max-w-md w-full">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-900 rounded-2xl shadow-xl mb-4 transition-transform hover:scale-105 duration-300">
            <span className="text-4xl">🏠</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-blue-950 dark:text-white mb-2">
            InmoLink
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Plataforma Profesional Inmobiliaria
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800 transition-all">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode === "signIn" ? "Iniciar Sesión" : "Crear Cuenta"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              {mode === "signIn" 
                ? "Ingrese sus credenciales para acceder al portal." 
                : "Únase a la red inmobiliaria más avanzada."}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {mode === "signUp" && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none dark:text-white"
                    placeholder="Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">
                    Tipo de Perfil
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("user")}
                      className={`py-2 px-4 rounded-xl text-sm font-bold border-2 transition-all ${
                        role === "user" 
                          ? "bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" 
                          : "border-gray-100 dark:border-gray-800 text-gray-400"
                      }`}
                    >
                      Comprador
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("agent")}
                      className={`py-2 px-4 rounded-xl text-sm font-bold border-2 transition-all ${
                        role === "agent" 
                          ? "bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" 
                          : "border-gray-100 dark:border-gray-800 text-gray-400"
                      }`}
                    >
                      Agente
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none dark:text-white"
                placeholder="ejemplo@inmolink.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contraseña
                </label>
                {mode === "signIn" && (
                  <button type="button" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                    ¿Olvidó su contraseña?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none dark:text-white"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center space-x-2 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <span>{mode === "signIn" ? "Acceder al Portal" : "Crear Mi Cuenta"}</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
              className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {mode === "signIn" 
                ? "¿No tiene una cuenta? Regístrese aquí" 
                : "¿Ya tiene cuenta? Inicie sesión"}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center space-y-4">
          <div className="inline-block p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-800">
            <p className="text-xs font-bold text-blue-900 dark:text-blue-400 uppercase tracking-widest mb-2">Entorno de Pruebas Local</p>
            <div className="grid grid-cols-1 gap-2 text-[10px] text-gray-500 dark:text-gray-400 font-mono">
              <p>Admin: admin@inmolink.com / admin123</p>
              <p>Agente: agent@inmolink.com / agent123</p>
              <p>Comprador: buyer@inmolink.com / buyer123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
