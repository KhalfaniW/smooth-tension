import styled from "styled-components";

export const GameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 50px;
  color: #444;

  border: 1px solid #1890ff;
`;

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
  return (
    <div className="max-w-sm  overflow-hidden shadow-lg shadow  bg-red-500">
      {children}
    </div>
  );
}
export function ReleaseTensionBox({children}) {
  return (
    <div className="max-w-sm  overflow-hidden shadow-lg shadow rounded bg-blue-500">
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
