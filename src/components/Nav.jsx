import React from "react";
import {
  FiBell,
  FiChevronDown,
  FiChevronsRight,
  FiHome,
  FiMessageSquare,
  FiHelpCircle,
  FiRadio,
  FiX
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink } from 'react-router-dom';
import FirusLogoSvg from '../assets/firus.svg?react';

// Define the navigation structure for the app
const appNavigation = [
  { title: 'Início', href: '/', icon: FiHome },
  { title: 'Firus IA', href: '/chat', icon: FiMessageSquare },
  { title: 'Reportar Incêndio', href: '/reportar-incendio', icon: FiRadio },
  { title: 'Suporte', href: '/suporte', icon: FiHelpCircle },
  { title: 'Notificações', href: '/notificacoes', icon: FiBell, notifs: 3 },
];

// Nav now accepts navOpen, setNavOpen, and isMobileLayout as props
const Nav = ({ navOpen, setNavOpen, isMobileLayout }) => {
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  const desktopWidth = navOpen ? "225px" : "76px"; // 76px for icon width approx.

  // Determine if internal components should display as "open"
  // For mobile, it's always true when the nav itself is open.
  // For desktop, it depends on the navOpen state (expanded or collapsed).
  const internalOpenState = isMobileLayout ? true : navOpen;

  if (isMobileLayout) {
    return (
      <AnimatePresence>
        {navOpen && (
          <motion.nav
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 left-0 z-50 h-screen w-[250px] shrink-0 border-r border-slate-300 bg-white p-4 shadow-lg flex flex-col"
          >
            {/* Mobile Close Button and Title */}
            <div className="flex justify-between items-center mb-4">
              <TitleSection open={true} isMobileLayout={isMobileLayout} />
              <button onClick={() => setNavOpen(false)} className="p-2 rounded-md hover:bg-slate-100">
                <FiX className="h-6 w-6 text-slate-600" />
              </button>
            </div>

            <div className="space-y-2 flex-grow overflow-y-auto">
              {appNavigation.map((item) => (
                <Option
                  key={item.title}
                  Icon={item.icon}
                  title={item.title}
                  href={item.href}
                  open={true}
                  notifs={item.notifs}
                  onClick={() => setNavOpen(false)}
                />
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    );
  }

  // Desktop Navigation
  return (
    <motion.nav
      layout
      className="fixed top-0 left-0 z-50 h-screen shrink-0 border-r border-slate-300 bg-white p-2 shadow-lg"
      style={{
        width: desktopWidth,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <TitleSection open={internalOpenState} isMobileLayout={isMobileLayout} />

      <div className="space-y-2">
        {appNavigation.map((item) => (
          <Option
            key={item.title}
            Icon={item.icon}
            title={item.title}
            href={item.href}
            open={internalOpenState}
            notifs={item.notifs}
          />
        ))}
      </div>

      <ToggleClose open={internalOpenState} setOpen={setNavOpen} />
    </motion.nav>
  );
};

const Option = ({ Icon, title, href, open, notifs, onClick }) => {
  return (
    <NavLink 
      to={href} 
      className="block"
      onClick={onClick}
    >
      {({ isActive }) => (
        <motion.button
          layout
          className={`relative flex h-10 w-full items-center rounded-md transition-colors ${
            isActive ? "bg-emerald-100 text-emerald-800" : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <motion.div
            layout
            className="grid h-full w-10 place-content-center text-lg shrink-0"
          >
            <Icon />
          </motion.div>
          {open && (
            <motion.span
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="text-xs md:text-sm font-medium whitespace-nowrap overflow-hidden"
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
              transition={{ delay: 0.25 }}
              className="absolute right-2 top-1/2 size-4 rounded bg-emerald-500 text-xs text-white ml-auto shrink-0"
            >
              {notifs}
            </motion.span>
          )}
        </motion.button>
      )}
    </NavLink>
  );
};

const TitleSection = ({ open, isMobileLayout }) => {
  return (
    <div className={`pb-3 ${isMobileLayout ? 'mb-0' : 'mb-3 border-b border-slate-300'}`}>
      <Link to="/" className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-slate-100">
          <Logo />
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
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
      className="grid size-10 shrink-0 place-content-center bg-transparent"
    >
      <FirusLogoSvg alt="Firus Logo" className="w-full h-full" />
    </motion.div>
  );
};

const ToggleClose = ({ open, setOpen }) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className="absolute bottom-0 left-0 right-0 h-10 border-t border-slate-300 transition-colors hover:bg-slate-100 w-full"
    >
      <div className="flex items-center p-2">
        <motion.div
          layout
          className="grid w-10 place-content-center text-lg shrink-0"
        >
          <FiChevronsRight
            className={`transition-transform ${open && "rotate-180"}`}
          />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="text-xs md:text-sm font-medium whitespace-nowrap overflow-hidden"
          >
            Recolher
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};

export default Nav;
