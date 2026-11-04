import { NavLink, Outlet } from 'react-router';

const nav = [
  { to: '/topics', label: 'Topics' },
  { to: '/today', label: 'Today' },
];

export default function Shell() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b border-line bg-ground/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center gap-2" aria-label="Role Prep home">
            <img src="/icons/logo-mark.svg" alt="" width={28} height={28} />
            <span className="font-display text-xl font-bold tracking-wide">Role Prep</span>
          </a>
          <nav className="flex gap-1 text-sm font-semibold">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to}
                className={({ isActive }) => `rounded-lg px-3 py-2 ${isActive ? 'bg-indigo text-white' : 'text-mist hover:text-white'}`}>
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-line py-6 text-center text-xs text-mist">
        Role Prep by <a href="https://aaryaai.dev" className="underline">AaryaAI</a> · interview practice for AI roles
      </footer>
    </div>
  );
}
