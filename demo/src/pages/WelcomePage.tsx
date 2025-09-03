import React from "react";
import { Vertical, Horizontal, Texto, BBDTag } from "@gravitate-js/excalibrr";

export function WelcomePage() {
  const recentDemos = [];

  return (
    <Vertical style={{ padding: "32px", maxWidth: "800px" }}>
      {/* Header */}
      <Vertical style={{ marginBottom: "32px" }}>
        <Texto
          category="heading"
          style={{ color: "var(--theme-color-2)", marginBottom: "8px" }}
        >
          Excalibrr Demo Showcase
        </Texto>
        <Texto
          category="p1"
          style={{ color: "var(--theme-color-3)", lineHeight: "1.6" }}
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
            {recentDemos.length} Demos
          </BBDTag>
        </Vertical>

        <Vertical style={{ minWidth: "120px" }}>
          <BBDTag success className="p-2 text-center">
            3 Themes
          </BBDTag>
        </Vertical>
      </Horizontal>

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
          Create Your First Demo
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
