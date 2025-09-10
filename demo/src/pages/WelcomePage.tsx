import React from "react";
import { Vertical, Horizontal, Texto, BBDTag } from "@gravitate-js/excalibrr";

type Demo = {
  path: string;
  name: string;
  description?: string;
  created: string;
};

export function WelcomePage() {
  // Available demos from pageConfig
  const availableDemos = [
    { name: "Product Grid", type: "Grid", description: "Editable product data grid with real-time updates" }
  ];
  
  const recentDemos: Demo[] = [];

  return (
    <Vertical style={{ padding: "32px", maxWidth: "800px" }}>
      {/* Header */}
      <Vertical style={{ marginBottom: "32px" }}>
        <Texto
          category="heading"
          className="mb-2"
        >
          Excalibrr Demo Showcase
        </Texto>
        <Texto
          category="p1"
          style={{ lineHeight: "1.6" }}
        >
          Interactive demonstrations of Excalibrr components using production
          patterns and themes. Generate new demos using Claude Code in the
          terminal.
        </Texto>
      </Vertical>

      {/* Quick stats */}
      <Horizontal
        style={{ gap: "24px", minHeight: "fit-content" }}
        className="mb-4"
      >
        <Vertical style={{ minWidth: "120px" }}>
          <BBDTag theme2 className="p-2 text-center">
            {availableDemos.length} Demo{availableDemos.length !== 1 ? 's' : ''}
          </BBDTag>
        </Vertical>

        <Vertical style={{ minWidth: "120px" }}>
          <BBDTag success className="p-2 text-center">
            14 Themes
          </BBDTag>
        </Vertical>
      </Horizontal>

      {/* Available Demos */}
      <Vertical style={{ marginBottom: "32px" }}>
        <Texto
          category="h5"
          className="mb-3"
          style={{ color: "var(--theme-color-2)" }}
        >
          Available Demos
        </Texto>
        {availableDemos.map((demo, index) => (
          <Horizontal
            key={index}
            style={{
              padding: "12px",
              border: "1px solid var(--theme-color-3)",
              borderRadius: "6px",
              marginBottom: "8px",
              backgroundColor: "var(--theme-bg-elevated)",
            }}
          >
            <Vertical style={{ flex: 1 }}>
              <Texto
                category="p1"
                style={{ fontWeight: "500", marginBottom: "4px" }}
              >
                {demo.name}
              </Texto>
              <Texto
                category="p2"
                style={{ color: "var(--theme-color-3)" }}
              >
                {demo.description}
              </Texto>
            </Vertical>
            <BBDTag theme2 style={{ alignSelf: "flex-start" }}>
              {demo.type}
            </BBDTag>
          </Horizontal>
        ))}
      </Vertical>

      {/* Recent demos */}
      {recentDemos.length > 0 && (
        <Vertical>
          <Texto
            category="h5"
            style={{ marginBottom: "16px", color: "var(--theme-color-2)" }}
          >
            Recent Demos
          </Texto>
          {recentDemos.map((demo) => (
            <Horizontal
              key={demo.path}
              style={{
                padding: "12px",
                border: "1px solid var(--theme-color-3)",
                borderRadius: "6px",
                marginBottom: "8px",
                backgroundColor: "var(--theme-bg-elevated)",
              }}
            >
              <Vertical>
                <Texto
                  category="p1"
                  style={{ fontWeight: "500", marginBottom: "4px" }}
                >
                  {demo.name}
                </Texto>
                {demo.description && (
                  <Texto
                    category="p2"
                    style={{ color: "var(--theme-color-3)" }}
                  >
                    {demo.description}
                  </Texto>
                )}
                <Texto
                  category="p2"
                  style={{ color: "var(--theme-color-3)", marginTop: "4px" }}
                >
                  Created {new Date(demo.created).toLocaleDateString()}
                </Texto>
              </Vertical>
            </Horizontal>
          ))}
        </Vertical>
      )}

      {/* Getting started */}
      <Vertical
        style={{
          padding: "24px",
          backgroundColor: "var(--theme-bg-elevated)",
          border: "1px solid var(--theme-color-3)",
          borderRadius: "8px",
        }}
      >
        <Texto
          category="h5"
          style={{ marginBottom: "12px", color: "var(--theme-color-2)" }}
        >
          Create More Demos
        </Texto>
        <Texto
          category="p2"
          style={{
            color: "var(--theme-color-3)",
            lineHeight: "1.6",
            marginBottom: "16px",
          }}
        >
          Use Claude Code in the terminal to generate interactive demos with
          real Excalibrr components.
        </Texto>

        <Vertical
          style={{
            padding: "16px",
            backgroundColor: "var(--theme-bg-secondary)",
            borderRadius: "6px",
            border: "1px solid var(--theme-color-3)",
          }}
        >
          <Texto
            category="p2"
            style={{ fontFamily: "monospace", color: "var(--theme-color-2)" }}
          >
            claude --chat
          </Texto>
          <Texto
            category="p2"
            style={{ color: "var(--theme-color-3)", marginTop: "8px" }}
          >
            Then try commands like:
          </Texto>
          <Vertical style={{ marginTop: "8px", marginLeft: "16px" }}>
            <Texto
              category="p2"
              style={{ color: "var(--theme-color-3)", marginBottom: "4px" }}
            >
              • "Create a product inventory grid"
            </Texto>
            <Texto
              category="p2"
              style={{ color: "var(--theme-color-3)", marginBottom: "4px" }}
            >
              • "Make a form for creating customers"
            </Texto>
            <Texto category="p2" style={{ color: "var(--theme-color-3)" }}>
              • "Show me a trading dashboard"
            </Texto>
          </Vertical>
        </Vertical>
      </Vertical>
    </Vertical>
  );
}
