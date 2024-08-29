"use client";
import React, { useState, useEffect } from "react";
import { HiMenu, HiChevronDown } from "react-icons/hi";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { MdClose, MdDashboard } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import ThemeSwitcher from "./ThemeSwitcher";
import useAuth from "@/lib/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaGithub, FaSignOutAlt, FaCog } from "react-icons/fa";

const Navbar = () => {
  const { currentUser, handleLogout, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const { scrollY } = useScroll();
  const [lastScrollY, setLastScrollY] = useState(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > lastScrollY && latest > 100) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    setLastScrollY(latest);
  });

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const menuItemVariants = {
    closed: { x: 20, opacity: 0 },
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    }),
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const menuItems = [
    {
      title: "Services",
      href: "#services",
      dropdown: [
        { title: "Web Development", href: "#" },
        { title: "Web Design", href: "#" },
        { title: "SEO Optimization", href: "#" },
      ],
    },
    { title: "About Us", href: "#about" },
    { title: "FAQ", href: "#faq" },
    { title: "Contact", href: "#contact" },
    { title: "Client Portal", href: "#", icon: "🔒" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <AnimatePresence>
        {isBannerVisible && (
          <motion.div
            initial={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.3 }}
            className="relative py-2 lg:py-3 text-sm lg:text-base text-center overflow-hidden"
            style={{
              background:
                "linear-gradient(to right, #FCD6FF, #FFFD80, #F89ABF, #FCD6FF)",
              backgroundSize: "200% 100%",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
          >
            <div className="container mx-auto">
              <p className="font-medium text-gray-800">
                <span className="hidden sm:inline">
                  Introducing a completely redesigned interface -{" "}
                </span>
                <a
                  href="#"
                  className="underline underline-offset-4 font-semibold hover:text-blue-700 transition-colors"
                >
                  Explore the demo
                </a>
              </p>
            </div>
            {/* <button
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-800 hover:text-gray-600 transition-colors"
              onClick={() => setIsBannerVisible(false)}
            >
              <MdClose size={20} />
            </button> */}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="bg-secondary bg-opacity-90 backdrop-blur-lg shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo (2).png" alt="logo" width={30} height={30} />
              <span className="text-xl pl-3 font-semibold">Web Realm</span>
            </Link>
            <div className="hidden md:flex items-center space-x-10">
              {menuItems.map((item) => (
                <div
                  key={item.title}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(item.title)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className="transition-colors duration-200 flex items-center"
                  >
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    {item.title}
                    {item.dropdown && <HiChevronDown className="ml-1" />}
                  </Link>
                  {item.dropdown && (
                    <AnimatePresence>
                      {activeDropdown === item.title && (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={dropdownVariants}
                          className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-[#1a1a2e] ring-1 ring-black ring-opacity-5 overflow-hidden"
                        >
                          <div className="py-1">
                            {item.dropdown.map((subItem) => (
                              <motion.div
                                key={subItem.title}
                                whileHover={{ backgroundColor: "#2a2a3e" }}
                              >
                                <Link
                                  href={subItem.href}
                                  className="block px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                  {subItem.title}
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>
            <ThemeSwitcher />
            <div className="flex items-center space-x-4">
              {!loading && currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none">
                    <Image
                      src={currentUser.photoURL || "/placeholder.png"}
                      alt="User Profile"
                      width={40}
                      height={40}
                      className="rounded-full w-12 p-1 hover:bg-secondary-foreground/10 h-12 object-cover cursor-pointer"
                    />{" "}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Link href="/dashboard" className="flex items-center">
                          <MdDashboard className="mr-4 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FaCog className="mr-4 h-4 w-4" />
                        <span>Settings</span>
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <FaGithub className="mr-4 h-4 w-4" />
                      <span>GitHub</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <FaSignOutAlt className="mr-4 h-4 w-4" />
                      <span>Log out</span>
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-6">
                  <Link href="/login">
                    <Button>Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Register</Button>
                  </Link>
                </div>
              )}
              <div className="md:hidden">
                <button onClick={toggleMenu} className="focus:outline-none">
                  <HiMenu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#0e0e16] bg-opacity-95 backdrop-blur-lg z-40 md:hidden"
          >
            <div className="flex flex-col items-start justify-center h-full p-10 space-y-8">
              <button
                onClick={toggleMenu}
                className="self-end focus:outline-none"
              >
                <MdClose className="h-8 w-8 text-white" />
              </button>
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  custom={index}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={menuItemVariants}
                >
                  <Link
                    href={item.href}
                    className="block text-lg text-white font-semibold"
                  >
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    {item.title}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
