import { useState } from "react"
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQAccordion = ({ title, answer }) => {
    const [accordingOpen, setAccordingOpen] = useState(false);

    return (
        <div className="py-4 border-b border-gray-200">
            <button onClick={() => setAccordingOpen(!accordingOpen)} className="flex justify-between items-center w-full text-left group">
                <h3 className="font-semibold text-gray-800 text-lg group-hover:text-[#54AE21] transition-colors">{title}</h3>
                {accordingOpen ? 
                    <ChevronUp className="w-5 h-5 text-[#54AE21] duration-200" /> : 
                    <ChevronDown className="w-5 h-5 text-gray-500 duration-200 group-hover:text-[#54AE21]" />
                }
            </button>

            <div className={`grid overflow-hidden transition-all duration-300 ease-in-out text-gray-600 text-base ${
                accordingOpen ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'
            }`}>
                <div className="overflow-hidden">{answer}</div>
            </div>
        </div>
    )
}

export default FAQAccordion