import React from "react";

import { ComponentConfig } from "@measured/puck";
import { Section } from "../../components/Section";
import { WithLayout, withLayout } from "../../components/Layout";

// Define size values explicitly based on previous options
type Size = "xxxl" | "xxl" | "xl" | "l" | "m" | "s" | "xs";

export type HeadingProps = WithLayout<{
  align: "left" | "center" | "right";
  text?: string;
  level: 1 | 2 | 3 | 4 | 5 | 6; // Use standard heading levels
  size: Size; // Use the defined Size type
}>;

const sizeOptions: { value: Size; label: string }[] = [
  { value: "xxxl", label: "XXXL" },
  { value: "xxl", label: "XXL" },
  { value: "xl", label: "XL" },
  { value: "l", label: "L" },
  { value: "m", label: "M" },
  { value: "s", label: "S" },
  { value: "xs", label: "XS" },
];

const levelOptions = [
  { label: "1", value: 1 }, // Use numbers for values
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
];

// Map size prop values to CSS font sizes
const sizeMap: Record<Size, string> = {
  xxxl: "4rem",
  xxl: "3rem",
  xl: "2.5rem",
  l: "2rem",
  m: "1.5rem",
  s: "1.25rem",
  xs: "1rem",
};

const HeadingInternal: ComponentConfig<HeadingProps> = {
  fields: {
    text: {
      type: "textarea",
    },
    size: {
      type: "select",
      options: sizeOptions,
    },
    level: {
      type: "select", // Keep as select
      options: levelOptions, // Use updated options
    },
    align: {
      type: "radio",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
  },
  defaultProps: {
    align: "left",
    text: "Heading",
    level: 2, // Default to level 2 (h2)
    size: "m",
    layout: {
      padding: "8px",
    },
  },
  render: ({ align, text, size, level }) => {
    // Dynamically create the heading tag (h1-h6)
    const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;

    return (
      <Section>
        <Tag
          style={{ textAlign: align, fontSize: sizeMap[size], width: "100%" }}
        >
          {text}
        </Tag>
      </Section>
    );
  },
};

export const Heading = withLayout(HeadingInternal);
