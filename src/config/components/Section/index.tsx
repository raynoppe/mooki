import { CSSProperties, forwardRef, ReactNode } from "react";
import styles from "./styles.module.css";
import getClassNameFactory from "@/lib/get-class-name-factory";

const getClassName = getClassNameFactory("Section", styles);

export type SectionProps = {
  className?: string;
  children: ReactNode;
  maxWidth?: string;
  style?: CSSProperties;
};

// eslint-disable-next-line react/display-name
export const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ children, className, maxWidth = "1280px", style = {} }, ref) => {
    return (
      <div
        className={`${getClassName()}${className ? ` ${className}` : ""}`}
        style={{
          ...style,
        }}
        ref={ref}
      >
        <div className={getClassName("inner")} style={{ maxWidth }}>
          {children}
        </div>
      </div>
    );
  }
);
