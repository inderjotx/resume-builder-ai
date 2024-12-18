import { Github, Linkedin, Twitter } from "lucide-react";
import { siteConfig } from "@/config";
const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-black text-white">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <a href={siteConfig.url} className="flex items-center">
              <siteConfig.logo className="me-3 h-8" />
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                {siteConfig.appName}
              </span>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-white">
                Resources
              </h2>
              <ul className="font-medium text-gray-300">
                <li className="mb-4">
                  <a href="https://flowbite.com/" className="hover:underline">
                    Flowbite
                  </a>
                </li>
                <li>
                  <a
                    href="https://tailwindcss.com/"
                    className="hover:underline"
                  >
                    Tailwind CSS
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-white">
                Follow us
              </h2>
              <ul className="font-medium text-gray-300">
                <li className="mb-4">
                  <a
                    href="https://github.com/themesberg/flowbite"
                    className="hover:underline"
                  >
                    Github
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.gg/4eeurUVvTy"
                    className="hover:underline"
                  >
                    Discord
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-white">
                Legal
              </h2>
              <ul className="font-medium text-gray-300">
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-600 sm:mx-auto lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-300 sm:text-center">
            © {new Date().getFullYear()}{" "}
            <a href={siteConfig.url} className="hover:underline">
              {siteConfig.appName}
            </a>
            . All Rights Reserved.
          </span>
          <div className="mt-4 flex sm:mt-0 sm:justify-center">
            <a
              href={siteConfig.links.twitter}
              className="text-gray-400 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter page</span>
            </a>
            <a
              href={siteConfig.links.github}
              className="ms-5 text-gray-400 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub account</span>
            </a>
            <a
              href={siteConfig.links.linkedin}
              className="ms-5 text-gray-400 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn account</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
