// components/CodeBlock.jsx
import React from "react";
import Editor from "@monaco-editor/react";
import type { ComponentConfig, CustomField } from "@measured/puck";

// Define the props interface based on defaultProps and usage
interface CodeBlockProps {
  code?: string;
  language?: string;
  showLineNumbers?: boolean;
  puck?: unknown; // Use unknown instead of any for Puck-specific props
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code = "",
  language = "javascript", // Default to javascript if not provided
  showLineNumbers = true,
}) => {
  if (!code) {
    return null; // Don't render if there's no code
  }

  return (
    <Editor
      height="200px" // Default height, can be customized
      language={language}
      theme="vs-dark" // Use VS Dark theme as a default
      value={code}
      options={{
        readOnly: true, // Make the display editor read-only
        minimap: { enabled: false }, // Optionally disable minimap
        lineNumbers: showLineNumbers ? "on" : "off", // Control line numbers
        scrollBeyondLastLine: false,
        automaticLayout: true, // Ensure editor resizes correctly
      }}
    />
  );
};

// Custom input component using Monaco Editor for Puck fields
const MonacoInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  // Field props are passed by Puck
  field: CustomField<string | undefined>; // Use Puck's CustomField type
}> = ({ value, onChange, field }) => {
  return (
    <div>
      {field?.label && (
        <label style={{ display: "block", marginBottom: "8px" }}>
          {field.label}
        </label>
      )}
      <Editor
        height="200px"
        language="javascript" // Default language for the input editor
        theme="vs-dark"
        value={value}
        onChange={(newValue) => onChange(newValue || "")}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

// Define the component configuration for Puck
export const CodeBlockConfig: ComponentConfig<CodeBlockProps> = {
  fields: {
    code: {
      type: "custom", // Use custom field type
      label: "Code",
      // Destructure props provided by Puck's custom field render
      render: ({
        value,
        onChange,
        field /* removed unused name and puck */,
      }) => (
        // Ensure value passed is a string, default to empty if undefined
        <MonacoInput value={value || ""} onChange={onChange} field={field} />
      ),
    },
    language: {
      type: "text",
      label: "Language (e.g., jsx, javascript, css, html, python)",
    },
    showLineNumbers: {
      type: "radio",
      label: "Show Line Numbers",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
  },
  defaultProps: {
    code: `function greet() {
  console.log("Hello, world!");
}`,
    language: "javascript",
    showLineNumbers: true,
  },
  // The render function now correctly receives typed props based on CodeBlockProps
  render: ({ code, language, showLineNumbers, puck }) => {
    // Ensure showLineNumbers is boolean, Puck might store it differently
    const showLines =
      showLineNumbers === true || String(showLineNumbers) === "true";

    // Pass the props down to the actual CodeBlock component
    return (
      <CodeBlock
        code={code}
        language={language}
        showLineNumbers={showLines}
        puck={puck} // Pass puck prop
      />
    );
  },
};
