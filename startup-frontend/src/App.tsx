import { useState, useEffect } from "react";
import { LogOutButton } from "./components/logout-button.tsx";

function App() {

  const quotes = [
    "Innovation distinguishes between a leader and a follower",
    "I want to put a ding in the universe",
    "Stay hungry, stay foolish",
    "Design is not just what it looks like and feels like. Design is how it works",
    "Be a yardstick of quality. Some people aren't used to an environment where excellence is expected",
    "Sometimes life is going to hit you in the head with a brick. Don't lose faith",
    "Creativity is just connecting things",
    "Focus and simplicity",
    "Great things in business are never done by one person. They're done by a team of people"
  ];
  const [quote, setQuote] = useState<string>('');

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <div className="mx-auto max-w-4xl p-24">
      <div className="absolute top-4 right-4">
        <LogOutButton />
      </div>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        React + Vite + Typescript + Tailwind boilerplate
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Started another project...
      </p>
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Thoughts and concerns
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Have you taken the time to think throughroughly and considered{" "}
        <a
          /* onClick={() => window.open('https://www.apple.com', '_blank')} */
          href="/signin"
          className="font-medium text-primary underline underline-offset-4"
        >
          the stakeholders and market you've chosen?
        </a>
        
      </p>
      <blockquote className="mt-6 border-l-2 pl-6 italic">
        "{quote}" <br></br>- Steve Jobs
      </blockquote>
      <h3 className="mt-8 scroll-m-20 text-2xl tracking-tight font-italic">
        Wishing you well,
      </h3>
      <h3 className="mt-4 scroll-m-20 text-xl font-light tracking-tight">- Pranav</h3>
      
    </div>
  )
}

export default App;