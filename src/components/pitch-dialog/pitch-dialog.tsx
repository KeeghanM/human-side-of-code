import { useRef, useState } from 'react';

interface PitchProps {
  tabs: { id: string; title: string; content: { html: string } }[];
}
export default function PitchDialog({ tabs }: PitchProps) {
  const [activeTab, setActiveTab] = useState<string>(tabs[Math.floor(tabs.length / 2)].id);
  const ref = useRef<HTMLDialogElement>(null);
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <>
      <button
      className="cursor-pointer text-black hover:text-primary uppercase font-bold text-xl"
        onClick={() => {
          if (ref.current) {
            ref.current.showModal();
          }
        }}
      >
        About
      </button>
      <dialog
        ref={ref}
        className="bg-white p-8 max-w-4xl mx-auto my-8 rounded shadow-lg text-center"
      >
        <button onClick={() => ref.current?.close()} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="options flex justify-center gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`btn-${tab.id}`}
              className={`tab-btn px-4 py-2 rounded hover:bg-primary cursor-pointer ${activeTab === tab.id ? 'bg-primary' : 'bg-gray-300'}`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.title}
            </button>
          ))}
        </div>
        <div className="mb-4" dangerouslySetInnerHTML={{ __html: tabs.find((tab) => tab.id === activeTab)?.content.html || '' }} />
        <p className="mt-4 font-bold">
          Remember: Even the most elegant code is written by humans, for humans. Let's make sure
          you're fluent in both languages.
        </p>
        <div className="creators flex justify-center gap-4 mt-4">
          <div className="flex flex-col items-center">
            <img src="/Keeghan.png" alt="Keeghan" className="h-24" />
            <h3 className="font-light text-sm italic">Keeghan</h3>
          </div>
        </div>
      </dialog>
    </>
  );
};

