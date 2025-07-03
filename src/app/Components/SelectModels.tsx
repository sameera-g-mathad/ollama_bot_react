import React, { memo, useContext, useEffect, useState } from 'react';
import ChatContext from '../Context/ChatContext';
import { DeleteSVG } from '../SVG';
import ThemeContext from '../Context/ThemeContext';
import { SearchBar } from './SearchBar';


/**
 * This component allows users to select and manage models for the chat application.
 * It displays a list of available models, allows users to add new models, delete existing ones,
 * and select an active model for the chat.
 * @returns A React component that renders the model selection interface.
 */
export const SelectModels = memo(() => {
  const { activeModel, models, deleteModel, addModel, selectModel } =
    useContext(ChatContext);
  const { theme } = useContext(ThemeContext);
  const [modelVisible, setModelVisible] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('');

  useEffect(() => {
    setSelectedModel(activeModel);
  }, [activeModel]);

  return (
    <div>
      <div
        onClick={() => setModelVisible((prev) => !prev)}
        className={`border absolute sm:left-1/2 left-[70%] transfrom -translate-x-1/2 top-2 ${activeModel ? 'visible' : 'hidden'
          } rounded-lg p-1 px-2 flex justify-center items-center tracking-wide font-medium`}
      >
        <div
          className={`w-2 h-2 ${activeModel ? 'bg-blue-500' : ''
            } rounded-full m-1`}
        ></div>
        {activeModel}
      </div>
      <div
        className={`absolute ${theme === 'light' ? 'bg-white' : 'bg-gray-800'
          } ${modelVisible ? 'visible' : 'hidden'
          } sm:w-1/2 w-full h-1/2 top-1/2 left-1/2 rounded-lg transform -translate-x-1/2 -translate-y-1/2 border`}
      >
        <SearchBar theme={theme} callback={addModel} />
        <label className="pl-6 text-sm">
          Fetching new models may take some time. Check later for updated list.
        </label>
        <div className="overflow-auto mx-4">
          {models.map((el, i) => (
            <div
              key={i}
              onClick={() => setSelectedModel(el)}
              className={`flex ${selectedModel === el ? 'bg-blue-200 border-blue-500' : ''
                } justify-between p-3 px-4 mt-2 border rounded-lg shadow-sm`}
            >
              <span className='font-bold'>{el}</span>
              <button onDoubleClick={() => deleteModel(el)}>
                <DeleteSVG theme={'red'} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex absolute bottom-0 right-0 p-4">
          <button
            onClick={() => setModelVisible((prev) => !prev)}
            className="mr-2  p-2 rounded-lg bg-red-500 text-white active:bg-red-700"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              selectModel(selectedModel);
              setModelVisible((prev) => !prev);
            }}
            className=" p-2 rounded-lg bg-green-500 text-white active:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
});
