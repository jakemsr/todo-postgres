import ThemeToggle from "@/components/theme-toggle";


export default function Background({children}: {children: React.ReactNode}) {
  return (
    <main role="main" className="min-h-svh flex justify-center bg-black">
      <div className="w-360 bg-white dark:bg-navy-950 bg-hero bg-top bg-no-repeat flex flex-col items-center">
        <div className="flex justify-between w-140 mt-20 text-white font-bold text-5xl tracking-[0.3em] uppercase">
          todo
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-center w-full">
          {children}
        </div>
      </div>
    </main>
  );
}
