import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

function StackedCircularFooter() {
  return (
    <footer className="bg-white py-12 dark:bg-zinc-950">
      <div className="mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center">
          <div className="mb-8 rounded-full bg-zinc-900/10 p-8 dark:bg-zinc-50/10">
          <Icons.logo className="icon-class w-6" />
          </div>
          <nav className="mb-8 flex flex-wrap justify-center gap-6">
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50">Home</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50">About</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50">Services</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50">Products</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50">Contact</a>
          </nav>
          <div className="mb-8 flex space-x-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Facebook</span>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Instagram className="h-4 w-4" />
              <span className="sr-only">Instagram</span>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Button>
          </div>
          <div className="mb-8 w-full max-w-md">
            <form className="flex space-x-2">
              <div className="flex-grow">
                <Label htmlFor="email" className="sr-only">Email</Label>
                <Input id="email" placeholder="Enter your email" type="email" className="rounded-full" />
              </div>
              <Button type="submit" className="rounded-full">Subscribe</Button>
            </form>
          </div>
          <div className="text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              © 2024 Your Company. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { StackedCircularFooter }