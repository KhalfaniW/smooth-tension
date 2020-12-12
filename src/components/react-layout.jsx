import React from "react";

export function Stack({
  children,
  width = "100%",
  spacing = 1,
  align = "center",
}) {
  let SpacingOptions = {
    none: 0,
    even: 1,
    medium: 2,
    "xx-small": 3,
    "x-small": 4,
    small: 5,
    large: 6,
    "x-large": 7,
    "xx-large": 8,
  };

  return (
    <div
      style={{
        width: width,
        display: "flex",
        placeItems: "center",
        flexDirection: "column",
      }}
    >
      {/* {children */}
      {/*  ?React.Children.map(children, (child) => { */}
      {/*      console.log(child.props.style); */}
      {/*      if( child.props.style){ */}

      {/*          return React.cloneElement(child, { */}
      {/*              style: {...child.props.style, opacity: 0.5}, */}
      {/*          }); */}
      {/*      } */}
      {/*      child */}
      {/*  })  */}
      {/*   : null} */}
      {/* {React.Children.map(children, (child) => { */}
      {/*   return <div style={{margin: 0}}>{child}</div>; */}
      {/* })} */}
      {React.Children.map(children, (child) => {
        const newProps = {style: {margin: spacing}};
        if (React.isValidElement(child)) {
          return React.cloneElement(child, newProps);
        }
        return child;
      })}
      {/* {children} */}
    </div>
  );
}
export function Inline({
  children,
  width = "100%",
  spacing = "even",
  align = "center",
}) {
  let SpacingOptions = [
    "even",
    "medium",

    "xx-small",

    "x-small",

    "small",

    "large",

    "x-large",

    "xx-large",
  ];

  return (
    <div
      style={{
        width: width,
        display: "flex",
        placeItems: "center",
        flexDirection: "row",
      }}
    >
      {children}
    </div>
  );
}
export function ItemLine({
  children,
  width = "100%",
  spacing = "even",
  align = "center",
}) {
  let SpacingOptions = [
    "even",
    "medium",

    "xx-small",

    "x-small",

    "small",

    "large",

    "x-large",

    "xx-large",
  ];
  if (spacing === "even") {
    return (
      <div
        style={{
          width: width,
          display: "flex",
          placeItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {children}
      </div>
    );
  }
  return (
    <div
      style={{
        width: width,
        display: "flex",
        placeItems: "center",
        flexDirection: "row",
      }}
    >
      {children}
    </div>
  );
}
