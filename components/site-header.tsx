"use client";
import Link from "next/link"
import { Fragment, useState } from 'react'

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Dialog,Menu, Transition } from '@headlessui/react'
import { useSession, signIn, signOut } from "next-auth/react"
import { Google,LoadingDots } from "@/components/shared/icons";
import { LayoutDashboard, LogOut } from "lucide-react";
import Image from "next/image";

export function SiteHeader() {
  const { data: session,status } = useSession()
  let [isOpen, setIsOpen] = useState(false)
  let [signinBtnClicked,setSigninBtnClicked]=useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
 
  }
  return (
    <>
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10 top-0 left-0 " onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 z-30 bg-gray-100 bg-opacity-10 backdrop-blur" />
        </Transition.Child>

        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden shadow-xl rounded bg-white align-middle md:max-w-md md:rounded-2xl md:border md:border-gray-200 transition-all">
              <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center md:px-16">
                <p className="text-black">Logo</p>
                <h3 className="font-display text-2xl font-bold text-black">Sign In</h3>
                <p className="text-sm text-gray-500">
                This is strictly for demo purposes - only your email and profile picture will be stored.
                </p>
              </div>
              <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 md:px-16">

              <button onClick={() => {
                signIn('google') ;  
                setSigninBtnClicked(true);
                }} className="border border-gray-200 bg-white text-black hover:bg-gray-50 flex h-10 w-full items-center justify-center space-x-3 rounded-md text-sm shadow-sm transition-all duration-75 focus:outline-none">
                    {
                    signinBtnClicked ?   <div className="py-2"><LoadingDots color="#808080" /></div> :  <><Google className="h-5 w-5 ml-2" /><p className="">Sign In with Google</p></>
                    }
                    
              </button>        
              </div>
              
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {
              session?.user && status ==='authenticated'&&
              <>
              <div className="z-10000 w-56 text-right">
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button className="inline-flex justify-center">
                      
                          <Image
                            alt={session?.user?.email || 'profile pic'}
                            src={session?.user?.image || `https://avatars.dicebear.com/api/micah/tanveer.svg`}
                            width={40}
                            height={40}
                            priority
                            className="rounded-full"
                            blurDataURL={'https://avatars.dicebear.com/api/micah/tanveer.svg'}
                          placeholder="blur"
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="w-full rounded-md bg-white p-2 sm:w-56">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={`relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm text-gray-900 transition-all duration-75 hover:bg-gray-100`}
                                  onClick={() => signOut()}
                                >
                                  <LogOut className="h-4 w-4 mr-1" />
                                  <p>
                                      Logout
                                  </p>
                                </button>
                              )}
                            </Menu.Item>
                          
                          </div>
                      
                        </Menu.Items>
                      </Transition>
                    </Menu>
                </div>
              </>
            }
            {!session?.user && status!=='loading'&&  
            <>
                <button
                  type="button"
                  onClick={openModal}
                  className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                >
               
                  Log In
                </button>

            </>
            }
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <Icons.twitter className="h-5 w-5 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
    </>
  )
}
