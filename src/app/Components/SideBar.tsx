import React, { memo, useContext, useEffect } from "react";
import ChatContext from "../Context/ChatContext";
import { TrashSVG } from "../SVG";
import ThemeContext from "../Context/ThemeContext";
import { Button } from "./Button";

interface sidebarInterface {
    isOpen: boolean
}
export const SideBar: React.FC<sidebarInterface> = memo(({ isOpen }) => {
    const { theme } = useContext(ThemeContext)
    const { chatHistory, deleteChat, setConversation } = useContext(ChatContext)

    return <div className={`transition-all duration-300 top-0 left-0 fixed h-full   ${isOpen ?
        theme === 'light' ?
            'w-72 opacity-100 bg-gray-200' :
            'w-72 opacity-100 bg-gray-600' :
        'w-0 opacity-0'}`}>
        <div className="!mt-16 w-full flex flex-col overflow-y-scroll">
            {chatHistory.map((el, index) => {
                return <span className={` rounded p-1 m-2 flex items-center justify-between ${theme === 'light' ? 'hover:bg-gray-300' : 'hover:bg-gray-700'}`} key={index} onClick={() => setConversation(el.uuid)}>
                    <span>{el.title}</span>
                    <span onDoubleClick={() => deleteChat(el.uuid)}>
                        <TrashSVG theme={theme} />
                    </span>
                </span>
            })}
        </div>
    </div>;
});
