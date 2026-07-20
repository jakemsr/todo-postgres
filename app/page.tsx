import Link from "next/link";


export default function Home() {
  return (
    <div className="w-140 mt-10 text-center text-xl rounded-sm bg-white dark:bg-navy-900 p-6 shadow-xl">
      <h1 className="text-2xl font-bold mb-4">Welcome to the TODO App!</h1>
      <p>This TODO application is designed to help you manage your tasks efficiently.</p>
      <div className="mt-4 text-left">
        <p>You can:</p>
        <ul className="list-disc list-inside">
          <li>add tasks</li>
          <li>mark them as completed</li>
          <li>delete tasks as needed</li>
          <li>drag and drop tasks to reorder them</li>
        </ul>
      </div>
      <div className="mt-4 text-center">
        <Link href="/todo" className="text-blue-500 underline mx-1">
          Get started!
        </Link>
      </div>
    </div>
  );
}
