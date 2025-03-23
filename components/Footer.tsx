import Link from "next/link";
import { AiOutlineFacebook, AiOutlineInstagram, AiOutlineLink } from "react-icons/ai";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    {
      href: "https://www.instagram.com/laifa_coffee_official/",
      ariaLabel: "Facebook",
      icon: AiOutlineFacebook,
    },
    {
      href: "https://www.instagram.com/laifa_coffee_official/",
      ariaLabel: "Instagram",
      icon: AiOutlineInstagram,
    },
    {
      href: "https://linktr.ee/originalslaifa",
      ariaLabel: "Linktree",
      icon: AiOutlineLink,
    },
  ]

  return (
    <footer className="bg-slate-200 border-t border-gray-100 dark:bg-slate-800 shadow-sm text-gray-400 py-6 dark:border-t dark:border-gray-800">
      <div className="container mx-auto px-4 flex flex-wrap justify-center sm:justify-between items-center text-sm">
        <p className="ml-4">&copy; {currentYear} Laifa Coffee Wall. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 mr-4 sm:mt-0 text-black dark:text-white">
            {socialLinks.map(({ href, ariaLabel, icon: Icon }, index) => (
            <Link target="_blank" key={index} href={href} aria-label={ariaLabel} className="hover:opacity-70">
              <Icon className="w-5 h-5" />
            </Link>
            ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
