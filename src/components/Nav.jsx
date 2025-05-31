import React from "react"; // Removed useState as it's now a prop
import {
  FiBell,
  FiChevronDown,
  FiChevronsRight,
  FiHome,
  FiMessageSquare,
  FiHelpCircle,
  FiRadio,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { Link, NavLink } from 'react-router-dom'; // Removed useLocation as it's not used here
import FirusLogoSvg from '../assets/firus.svg?react'; // Changed to firus.svg?react

// Define the navigation structure for the app
const appNavigation = [
  { title: 'Início', href: '/', icon: FiHome },
  { title: 'Firus IA', href: '/chat', icon: FiMessageSquare },
  { title: 'Reportar Incêndio', href: '/reportar-incendio', icon: FiRadio },
  { title: 'Suporte', href: '/suporte', icon: FiHelpCircle },
  { title: 'Notificações', href: '/notificacoes', icon: FiBell, notifs: 3 },
];

// Nav now accepts open and setOpen as props
const Nav = ({ open, setOpen }) => {

  return (
    <motion.nav
      layout
      className="fixed top-0 left-0 z-50 h-screen shrink-0 border-r border-slate-300 bg-white p-2 shadow-lg"
      style={{
        width: open ? "225px" : "fit-content",
      }}
    >
      <TitleSection open={open} />

      <div className="space-y-2">
        {appNavigation.map((item) => (
          <Option
            key={item.title}
            Icon={item.icon}
            title={item.title}
            href={item.href}
            open={open}
            notifs={item.notifs}
          />
        ))}
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
};

const Option = ({ Icon, title, href, open, notifs }) => {
  return (
    <NavLink to={href} className="block">
      {({ isActive }) => (
        <motion.button
          layout
          className={`relative flex h-10 w-full items-center rounded-md transition-colors ${
            isActive ? "bg-emerald-100 text-emerald-800" : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <motion.div
            layout
            className="grid h-full w-10 place-content-center text-lg"
          >
            <Icon />
          </motion.div>
          {open && (
            <motion.span
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
              className="text-xs font-medium"
            >
              {title}
            </motion.span>
          )}

          {notifs && open && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              style={{ y: "-50%" }}
              transition={{ delay: 0.5 }}
              className="absolute right-2 top-1/2 size-4 rounded bg-emerald-500 text-xs text-white"
            >
              {notifs}
            </motion.span>
          )}
        </motion.button>
      )}
    </NavLink>
  );
};

const TitleSection = ({ open }) => {
  return (
    <div className="mb-3 border-b border-slate-300 pb-3">
      <Link to="/" className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-slate-100">
          <Logo />
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
            >
              <span className="block text-lg font-bold text-emerald-700">Firus</span>
            </motion.div>
          )}
      </Link>
    </div>
  );
};

const Logo = () => {
  return (
    <motion.div
      layout
      // Removed background and explicit rounding from container
      className="grid size-10 shrink-0 place-content-center bg-transparent"
    >
      {/* Using the imported SVG component directly */}
      <FirusLogoSvg alt="Firus Logo" className="w-full h-full" />
    </motion.div>
  );
};

const ToggleClose = ({ open, setOpen }) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className="absolute bottom-0 left-0 right-0 h-10 border-t border-slate-300 transition-colors hover:bg-slate-100"
    >
      <div className="flex items-center p-2">
        <motion.div
          layout
          className="grid w-10 place-content-center text-lg"
        >
          <FiChevronsRight
            className={`transition-transform ${open && "rotate-180"}`}
          />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-medium"
          >
            Recolher
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};

export default Nav;
