import styled from "styled-components";

// export const HoldTensionBox = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   width: 100%;
//   color: #444;
//   border: 1px solid red;
// `;

export function HoldTensionBox({children}) {
  // <div className="text-2xl pb-4 text-coolGray-50 max-w-sm  overflow-hidden shadow-lg shadow  bg-red-500">
  return (
    <div className="mt-2 mb-2 text-xl pb-3 px-8 py-3 font-semibold  bg-red-500 text-coolGray-100 ">
      {children}
    </div>
  );
}
export function ReleaseTensionBox({children}) {
  return (
    <div className="mt-2 mb-2 text-xl px-8 py-3 font-semibold rounded-full bg-blue-500 text-coolGray-100 ">
      {children}
    </div>
  );
}

// export const ReleaseTensionBox = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   width: 100%;
//   color: #444;
//   border: 1px solid blue;
// `;
