import React from 'react';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import logo from '../../assets/icons/clawlogo.png';

const FirstDraftDialog = ({
  open,
  onClose,
  currentPage,
  pages,
  firstDraft,
  handlePrevious,
  handleNext,
  handleTextChange,
  isEditing,
}) => {
  if (!open) return null;

  return (
    <div
      style={{
        width: '100%',
        height: '105%',
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        zIndex: '3',
        paddingTop: '30px',
      }}
    >
      <div
        className="h-fit rounded-md border-2 border-white"
        style={{
          background: 'linear-gradient(to right,#0e1118,#008080)',
        }}
      >
        {/* Close Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <svg
            onClick={onClose}
            style={{ margin: '20px', cursor: 'pointer' }}
            width="30"
            height="30"
            fill="white"
            stroke="white"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm0 7.425 2.717-2.718c.146-.146.339-.219.531-.219.404 0 .75.325.75.75 0 .193-.073.384-.219.531l-2.717 2.717 2.727 2.728c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.384-.073-.53-.219l-2.729-2.728-2.728 2.728c-.146.146-.338.219-.53.219-.401 0-.751-.323-.751-.75 0-.192.073-.384.22-.531l2.728-2.728-2.722-2.722c-.146-.147-.219-.338-.219-.531 0-.425.346-.749.75-.749.192 0 .385.073.531.219z"
              fillRule="nonzero"
            />
          </svg>
        </div>

        {/* Dialog Content */}
        <div style={{ margin: '0px', display: 'flex', flexDirection: 'column' }}>
          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-5">
            <div className="flex flex-col md:flex-row justify-center py-5 w-full items-center">
              <button
                onClick={handlePrevious}
                className="p-2 mx-2 bg-white text-black rounded-full"
                style={{
                  visibility: currentPage === 0 ? 'hidden' : 'visible',
                }}
                disabled={currentPage === 0}
              >
                <ArrowLeft />
              </button>
              <div className="flex flex-col w-full md:w-[30rem] bg-white text-black h-[50vh] md:h-[70vh] overflow-y-auto">
                <div className="w-full px-2 h-fit my-2 items-center flex flex-row ">
                  <p className="uppercase font-bold my-2 w-full ">
                    First Draft Preview
                  </p>
                  <div className="flex flex-row w-full items-center">
                    <div className="h-1 bg-neutral-900 w-2/3" />
                    <div className="bg-neutral-900 rounded-md">
                      <img
                        className="w-[44px] h-[29px]"
                        src={logo}
                        alt="logo"
                      />
                    </div>
                  </div>
                </div>
                <textarea
                  className="w-full h-full p-2.5 mb-4 text-black resize-none"
                  value={firstDraft}
                  onChange={handleTextChange}
                  readOnly={!isEditing}
                />
                <div className="text-right p-1 mx-2 font-semibold">
                  Page {currentPage + 1}
                </div>
              </div>
              <button
                onClick={handleNext}
                className="p-2 mx-2 bg-white text-black rounded-full"
                style={{
                  visibility: currentPage === pages.length - 1 ? 'hidden' : 'visible',
                }}
                disabled={currentPage === pages.length - 1}
              >
                <ArrowRight />
              </button>
            </div>
            <div className="h-[70vh] w-1 bg-neutral-200/40 hidden md:block" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstDraftDialog;
