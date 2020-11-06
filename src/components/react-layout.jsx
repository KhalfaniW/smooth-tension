import React from "react";

export function Stack({
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
        flexDirection: "column",
      }}
    >
      {children}
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
