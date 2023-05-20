// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import useScroll from "@/lib/hooks/use-scroll";
// import { useSignInModal } from "./sign-in-modal";
// import UserDropdown from "./user-dropdown";
// import { Session } from "next-auth";

// export default function NavBar({ session }: { session: Session | null }) {
//   const { SignInModal, setShowSignInModal } = useSignInModal();
//   const scrolled = useScroll(50);

//   return (
//     <>
//       <SignInModal />
//       <div
//         className={`fixed top-0 w-full ${
//           scrolled
//             ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
//             : "bg-white/0"
//         } z-30 transition-all`}
//       >
//         <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
//           <Link href="/" className="flex items-center font-display text-2xl">
//             <Image
//               src="/logo.png"
//               alt="Precedent logo"
//               width="30"
//               height="30"
//               className="mr-2 rounded-sm"
//             ></Image>
//             <p>Precedent</p>
//           </Link>
//           <div>
//             {session ? (
//               <UserDropdown session={session} />
//             ) : (
//               <button
//                 className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
//                 onClick={() => setShowSignInModal(true)}
//               >
//                 Sign In
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


// "use client";

// import * as React from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { NavItem } from "@/types/nav";
// import { siteConfig } from "@/config/site";
// import { cn } from "@/lib/utils";
// import { Icons } from "@/components/icons";
// import useScroll from "@/lib/hooks/use-scroll";
// import { useSignInModal } from "./sign-in-modal";
// import UserDropdown from "./user-dropdown";
// import { Session } from "next-auth";

// interface NavBarProps {
//   items?: NavItem[];
//   session: Session | null;
// }

// export default function NavBar({ items, session }: NavBarProps) {
//   const { SignInModal, setShowSignInModal } = useSignInModal();
//   const scrolled = useScroll(50);

//   return (
//     <>
//       <SignInModal />
//       <div
//         className={`fixed top-0 w-full ${
//           scrolled
//             ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
//             : "bg-white/0"
//         } z-30 transition-all`}
//       >
//         <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
//           <Link href="/" className="flex items-center font-display text-2xl">
//             <Icons.logo className="h-6 w-6 mr-2 rounded-sm" />
//             <span className="hidden font-bold sm:inline-block">
//               {siteConfig.name}
//             </span>
//           </Link>
//           {items?.length ? (
//             <nav className="hidden gap-6 md:flex">
//               {items?.map(
//                 (item, index) =>
//                   item.href && (
//                     <Link
//                       key={index}
//                       href={item.href}
//                       className={cn(
//                         "flex items-center text-lg font-semibold text-muted-foreground sm:text-sm",
//                         item.disabled && "cursor-not-allowed opacity-80"
//                       )}
//                     >
//                       {item.title}
//                     </Link>
//                   )
//               )}
//             </nav>
//           ) : null}
//           <div>
//             {session ? (
//               <UserDropdown session={session} />
//             ) : (
//               <button
//                 className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
//                 onClick={() => setShowSignInModal(true)}
//               >
//                 Sign In
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { NavItem } from "@/types/nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import useScroll from "@/lib/hooks/use-scroll";
import { useSignInModal } from "./sign-in-modal";
import UserDropdown from "./user-dropdown";
import { Session } from "next-auth";

interface MainNavProps {
  items?: NavItem[];
  session: Session | null;
}

export default function MainNav({ items, session }: MainNavProps) {
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const scrolled = useScroll(50);

  return (
    <>
      <SignInModal />
      <div
        className={`fixed top-0 w-full ${
          scrolled
            ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
            : "bg-white/0"
        } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
          <Link href="/" className="flex items-center font-display text-2xl">
            <Icons.logo className="h-6 w-6 mr-2 rounded-sm" />
            <span className="hidden font-bold sm:inline-block">
              {siteConfig.name}
            </span>
          </Link>
          {items?.length ? (
            <nav className="hidden gap-6 md:flex">
              {items?.map(
                (item, index) =>
                  item.href && (
                    <Link
                      key={index}
                      href={item.href}
                      className={cn(
                        "flex items-center text-lg font-semibold text-muted-foreground sm:text-sm",
                        item.disabled && "cursor-not-allowed opacity-80"
                      )}
                    >
                      {item.title}
                    </Link>
                  )
              )}
            </nav>
          ) : null}
          <div>
            {session ? (
              <UserDropdown session={session} />
            ) : (
              <button
                className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                onClick={() => setShowSignInModal(true)}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

