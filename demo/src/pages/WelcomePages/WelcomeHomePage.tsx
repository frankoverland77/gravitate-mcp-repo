import React from "react";
import { Vertical, Horizontal, Texto, BBDTag } from "@gravitate-js/excalibrr";
import { getAllDemos } from "../../pageConfig";

export function WelcomeHomePage() {
  // Get all available demos from the registry
  const availableDemos = getAllDemos().map((demo) => ({
    name: demo.title,
    type: demo.category.charAt(0).toUpperCase() + demo.category.slice(1, -1), // "grids" -> "Grid"
    description: demo.description,
    path: demo.path,
    created: demo.created,
  }));

  // Show recent demos (last 5, sorted by creation date)
  const recentDemos = getAllDemos()
    .sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
    )
    .slice(0, 5)
    .map((demo) => ({
      path: demo.path,
      name: demo.title,
      description: demo.description,
      created: demo.created,
    }));

  // Group demos by category for better display
  const demosByCategory = availableDemos.reduce((acc, demo) => {
    const category = demo.type;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(demo);
    return acc;
  }, {} as Record<string, typeof availableDemos>);

  return (
    <Vertical className="p-4" style={{ maxWidth: "900px", margin: "0 auto" }}>
      {/* Header */}
      <Vertical className="mb-2">
        <Texto category="heading" className="mb-2">
          Excalibrr Demo Showcase
        </Texto>
        <Texto category="p1" style={{ lineHeight: "1.6" }}>
          Interactive demonstrations of Excalibrr components using production
          patterns and themes. Generate new demos using Claude Code in the
          terminal.
        </Texto>
      </Vertical>

      {/* Quick stats */}
      <Horizontal
        className="mb-4"
        style={{ gap: "24px", minHeight: "fit-content" }}
      >
        <Vertical style={{ minWidth: "120px" }}>
          <BBDTag theme2 className="p-2 text-center">
            {availableDemos.length} Demo{availableDemos.length !== 1 ? "s" : ""}
          </BBDTag>
        </Vertical>

        <Vertical style={{ minWidth: "120px" }}>
          <BBDTag success className="p-2 text-center">
            14 Themes
          </BBDTag>
        </Vertical>
      </Horizontal>

      {/* Available Demos - organized by category */}
      <Vertical className="mb-4">
        <Texto
          category="h5"
          className="mb-3"
          style={{ color: "var(--theme-color-2)" }}
        >
          Available Demos
        </Texto>

        {Object.entries(demosByCategory).map(([category, demos]) => (
          <Vertical key={category} className="mb-3">
            <Texto
              category="h5"
              className="mb-2"
              style={{ color: "var(--theme-color-2)" }}
            >
              {category}s ({demos.length})
            </Texto>

            {demos.map((demo, index) => (
              <Horizontal
                key={index}
                className="mb-2 p-2 border-radius-5"
                style={{ border: "1px solid var(--theme-color-3)" }}
                justifyContent="space-between"
                alignItems="center"
              >
                <Horizontal alignItems="center">
                  <Texto
                    category="p1"
                    className="mr-2"
                    style={{ fontWeight: "600" }}
                  >
                    {demo.name}:{" "}
                  </Texto>
                  <Texto category="p2">{demo.description}</Texto>
                </Horizontal>
                <BBDTag theme2 style={{ height: "fit-content" }}>
                  {demo.type}
                </BBDTag>
              </Horizontal>
            ))}
          </Vertical>
        ))}

        {availableDemos.length === 0 && (
          <Horizontal
            justifyContent="center"
            className="p-3 border-radius-5"
            style={{
              border: "2px dashed var(--theme-color-3)",
              backgroundColor: "var(--theme-bg-elevated)",
            }}
          >
            <Texto
              category="p2"
              className="text-center"
              style={{ color: "var(--theme-color-3)" }}
            >
              No demos available yet. Create your first demo using Claude Code!
            </Texto>
          </Horizontal>
        )}
      </Vertical>

      {/* Recent demos */}
      {recentDemos.length > 0 && (
        <Vertical>
          <Texto
            category="h5"
            className="mb-2"
            style={{ color: "var(--theme-color-2)" }}
          >
            Recent Demos
          </Texto>
          {recentDemos.map((demo) => (
            <Horizontal
              key={demo.path}
              className="mb-2 p-2 border-radius-5"
              style={{
                border: "1px solid var(--theme-color-3)",

                backgroundColor: "var(--theme-bg-elevated)",
              }}
            >
              <Vertical>
                <Texto
                  category="p1"
                  className="mr-2"
                  style={{ fontWeight: "500" }}
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
                  style={{ color: "var(--theme-color-3)" }}
                  className="mt-2"
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
        className="p-3 border-radius-5"
        style={{
          backgroundColor: "var(--theme-bg-elevated)",
          border: "1px solid var(--theme-color-3)",
        }}
      >
        <Texto
          category="h5"
          className="mb-2"
          style={{ color: "var(--theme-color-2)" }}
        >
          Create More Demos
        </Texto>
        <Texto
          category="p2"
          className="mb-2"
          style={{
            color: "var(--theme-color-3)",
            lineHeight: "1.6",
          }}
        >
          Use Claude Code in the terminal to generate interactive demos with
          real Excalibrr components.
        </Texto>

        <Vertical
          className="p-2 border-radius-5"
          style={{
            backgroundColor: "var(--theme-bg-secondary)",
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
            className="mt-1"
            style={{ color: "var(--theme-color-3)" }}
          >
            Then try commands like:
          </Texto>
          <Vertical className="mt-1 ml-2">
            <Texto
              category="p2"
              className="mb-1"
              style={{ color: "var(--theme-color-3)" }}
            >
              • "Create a product inventory grid"
            </Texto>
            <Texto
              category="p2"
              className="mb-1"
              style={{ color: "var(--theme-color-3)" }}
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
