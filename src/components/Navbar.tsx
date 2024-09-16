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
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Navbar = () => {
  const { currentUser, handleLogout, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const { scrollY } = useScroll();
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();

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

  const logOut = async () => {
    try {
      await handleLogout();
      router.push("/");
      toast.success("Successfully logged out!", {
        style: {
          border: "1px solid #50C878", // Emerald color border
          padding: "12px 16px",
          color: "#155724", // Dark green text for success message
        },
        iconTheme: {
          primary: "#50C878", // Emerald color for the icon
          secondary: "#F0FFF4", // Light green background for the icon
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally, show an error message to the user
      toast.error("Failed to logout!");
    }
  };

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
      title: "Features",
      href: "#about",
      dropdown: [
        { title: "AI Powered", href: "#" },
        { title: "User Freindly Interface", href: "#" },
        { title: "Real Time Features", href: "#" },
      ],
    },
    {
      title: "About The Developer(GitHub)",
      href: "https://github.com/Devsethi3/Novis",
      target: "_blank",
    },
    { title: "FAQ", href: "#faq" },
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
                  Collaboration feature coming soon! Stay tuned for updates. -
                </span>
                {"  "}
                <span className="inline lg:hidden">
                  Collaboration feature coming soon!
                </span>
                {/* <Link
                  target="_blank"
                  href="#"
                  className="underline underline-offset-4 font-semibold hover:text-blue-700 transition-colors"
                >
                  Twitter
                </Link>
                <span className="mx-2">or</span>
                <Link
                  target="_blank"
                  href="#"
                  className="underline underline-offset-4 font-semibold hover:text-blue-700 transition-colors"
                >
                  LinkedIn
                </Link> */}
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
              <Image src="/logo.svg" alt="logo" width={42} height={42} />
              <span className="text-2xl pl-3 font-semibold hidden lg:block">
                Novis
              </span>
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
                    target={item.target || "_self"}
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
                                  className="block px-4 py-2 text-sm text-gray-300 hover:transition-colors"
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
                    <DropdownMenuItem
                      onClick={logOut}
                      className="cursor-pointer"
                    >
                      <FaSignOutAlt className="mr-4 h-4 w-4" />
                      <span>Log out</span>
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center lg:gap-6 gap-2">
                  <Link href="/login">
                    <Button size="sm">
                      <LogIn size={14} className="mr-2 hidden lg:block" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">Register</Button>
                  </Link>
                </div>
              )}
              <div className="md:hidden">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleMenu}
                  className="focus:outline-none"
                >
                  <HiMenu className="h-5 w-5" />
                </Button>
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
            className="fixed inset-y-0 right-0 w-full max-w-sm dark:bg-[#0e1613] bg-[#f5fffc] bg-opacity-95 backdrop-blur-lg z-40 md:hidden"
          >
            <div className="flex flex-col items-start justify-center h-full p-8">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="my-4 w-full"
                  custom={index}
                  variants={menuItemVariants}
                >
                  <motion.a
                    href={item.href}
                    target={item.target || "_self"}
                    className="text-2xl font-semibold"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.title}
                  </motion.a>
                  {item.dropdown && (
                    <div className="mt-2 ml-4">
                      {item.dropdown.map((subItem) => (
                        <motion.a
                          key={subItem.title}
                          href={subItem.href}
                          className="block text-lg my-2"
                          whileHover={{ x: 5 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          }}
                        >
                          {subItem.title}
                        </motion.a>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              {!loading && currentUser ? (
                <div className="flex items-center mt-5 gap-4">
                  <Image
                    src={currentUser.photoURL || "/placeholder.png"}
                    alt="User Profile"
                    width={40}
                    height={40}
                    className="rounded-full w-16 p-1 hover:bg-secondary-foreground/10 h-16 object-cover cursor-pointer"
                  />
                  <Button onClick={logOut} variant="destructive">
                    <FaSignOutAlt className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex mt-5 items-center gap-4">
                  <Link href="/login">
                    <Button size="lg">
                      <LogIn size={14} className="mr-2 hidden lg:block" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="lg">Register</Button>
                  </Link>
                </div>
              )}
            </div>
            <motion.button
              className="absolute top-4 right-4"
              onClick={toggleMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <MdClose className="h-6 w-6" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
