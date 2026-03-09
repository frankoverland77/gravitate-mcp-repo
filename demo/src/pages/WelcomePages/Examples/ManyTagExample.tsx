import {
  ManyTag,
  Horizontal,
  Vertical,
  Texto,
} from "@gravitate-js/excalibrr";
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
  CodeOutlined,
  DatabaseOutlined,
  CloudOutlined,
} from "@ant-design/icons";
import { Input, Button, Select, Card } from "antd";
import { useState, useMemo } from "react";

export function ManyTagExample() {
  // Basic examples data
  const skills = ["React", "TypeScript", "Node.js", "MongoDB", "Docker", "AWS", "GraphQL", "Python"];
  const userRoles = ["Admin", "Editor", "Viewer"];
  const productCategories = ["Electronics", "Books", "Clothing", "Home & Garden", "Sports", "Toys"];

  // Interactive examples state
  const [dynamicTags, setDynamicTags] = useState(["React", "TypeScript", "Node.js"]);
  const [newTag, setNewTag] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(["Frontend", "Backend"]);

  // Complex data examples
  const users = [
    { id: 1, name: "John Doe", role: "Admin", skills: ["React", "Node.js"] },
    { id: 2, name: "Jane Smith", role: "Developer", skills: ["Python", "Django"] },
    { id: 3, name: "Bob Johnson", role: "Designer", skills: ["Figma", "Adobe XD"] },
  ];

  const projects = [
    { name: "E-commerce Platform", technologies: ["React", "Node.js", "MongoDB", "Redis", "AWS"] },
    { name: "Data Analytics Dashboard", technologies: ["Python", "Pandas", "PostgreSQL", "D3.js"] },
    { name: "Mobile App", technologies: ["React Native", "TypeScript", "Firebase"] },
  ];

  // Filtered search results
  const filteredSkills = useMemo(() => {
    if (!searchTerm) return skills;
    return skills.filter(skill =>
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, skills]);

  // Add new tag function
  const addTag = () => {
    if (newTag && !dynamicTags.includes(newTag)) {
      setDynamicTags([...dynamicTags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setDynamicTags(dynamicTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Vertical style={{ maxWidth: "900px", margin: "0 auto" }}>
      <Texto className="mb-3" category="h3">
        Many Tag Variations
      </Texto>

      {/* Basic Usage */}
      <Texto category="h5">Basic Usage</Texto>
      <Vertical className="mb-4">
        <Horizontal gap={20} style={{ flexWrap: "wrap" }}>
          <Card title="Skills (maxCount=3)" size="small" style={{ width: 300 }}>
            <ManyTag tagItems={skills} maxCount={3} />
          </Card>

          <Card title="User Roles (maxCount=2)" size="small" style={{ width: 300 }}>
            <ManyTag tagItems={userRoles} maxCount={2} />
          </Card>

          <Card title="Categories (maxCount=4)" size="small" style={{ width: 300 }}>
            <ManyTag tagItems={productCategories} maxCount={4} />
          </Card>
        </Horizontal>
      </Vertical>

      {/* Different MaxCount Values */}
      <Texto category="h5">MaxCount Variations</Texto>
      <Vertical className="mb-4">
        <Texto category="p2" className="mb-2">Same data with different maxCount values:</Texto>
        <Vertical gap={12}>
          <Horizontal verticalCenter>
            <Texto category="p2" style={{ minWidth: "120px" }}>maxCount=1:</Texto>
            <ManyTag tagItems={skills} maxCount={1} />
          </Horizontal>
          <Horizontal verticalCenter>
            <Texto category="p2" style={{ minWidth: "120px" }}>maxCount=3:</Texto>
            <ManyTag tagItems={skills} maxCount={3} />
          </Horizontal>
          <Horizontal verticalCenter>
            <Texto category="p2" style={{ minWidth: "120px" }}>maxCount=5:</Texto>
            <ManyTag tagItems={skills} maxCount={5} />
          </Horizontal>
          <Horizontal verticalCenter>
            <Texto category="p2" style={{ minWidth: "120px" }}>No limit:</Texto>
            <ManyTag tagItems={skills} maxCount={999} />
          </Horizontal>
        </Vertical>
      </Vertical>

      {/* Interactive Tag Management */}
      <Texto category="h5">Interactive Tag Management</Texto>
      <Vertical className="mb-4">
        <Card title="Add/Remove Tags" style={{ maxWidth: "600px" }}>
          <ManyTag tagItems={dynamicTags} maxCount={4} />
          <Horizontal gap={10} className="mt-3">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onPressEnter={addTag}
              placeholder="Enter new technology"
              style={{ flex: 1 }}
            />
            <Button onClick={addTag} icon={<PlusOutlined />}>Add</Button>
          </Horizontal>
          <Texto category="p2" className="mt-2" style={{ color: "var(--theme-color-3)" }}>
            Current tags can be managed. Try adding: "Vue", "Angular", "Svelte"
          </Texto>
          <Horizontal gap={5} style={{ marginTop: "10px", flexWrap: "wrap" }}>
            {dynamicTags.map(tag => (
              <Button
                key={tag}
                size="small"
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeTag(tag)}
              >
                Remove {tag}
              </Button>
            ))}
          </Horizontal>
        </Card>
      </Vertical>

      {/* Search and Filter */}
      <Texto category="h5">Search and Filter</Texto>
      <Vertical className="mb-4">
        <Card title="Search Technologies" style={{ maxWidth: "600px" }}>
          <Input
            placeholder="Search technologies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined />}
            className="mb-3"
          />
          <ManyTag
            tagItems={filteredSkills}
            maxCount={searchTerm ? 10 : 4}
          />
          <Texto category="p2" className="mt-2" style={{ color: "var(--theme-color-3)" }}>
            {searchTerm
              ? `Found ${filteredSkills.length} matching technologies`
              : "Try searching for: 'React', 'Node', or 'Python'"
            }
          </Texto>
        </Card>
      </Vertical>

      {/* Object Array Transformation */}
      <Texto category="h5">Object Array Transformation</Texto>
      <Vertical className="mb-4">
        <Horizontal gap={20} style={{ flexWrap: "wrap" }}>
          <Card title="User Names" size="small" style={{ width: 280 }}>
            <ManyTag tagItems={users.map(user => user.name)} maxCount={2} />
          </Card>

          <Card title="User Roles" size="small" style={{ width: 280 }}>
            <ManyTag tagItems={users.map(user => user.role)} maxCount={3} />
          </Card>

          <Card title="All User Skills" size="small" style={{ width: 280 }}>
            <ManyTag
              tagItems={users.flatMap(user => user.skills)}
              maxCount={3}
            />
          </Card>
        </Horizontal>
      </Vertical>

      {/* Grid/Table-like Display */}
      <Texto category="h5">Grid Cell Simulation</Texto>
      <Vertical className="mb-4">
        <Texto category="p2" className="mb-3">Simulating how ManyTag appears in grid cells:</Texto>
        <div style={{ border: "1px solid var(--theme-color-3)", borderRadius: "5px" }}>
          {projects.map((project, index) => (
            <Horizontal
              key={index}
              className="p-3"
              style={{
                borderBottom: index < projects.length - 1 ? "1px solid var(--theme-color-3)" : "none",
                backgroundColor: index % 2 === 0 ? "var(--theme-bg-elevated)" : "transparent"
              }}
              justifyContent="space-between"
              alignItems="center"
            >
              <Vertical style={{ flex: 1 }}>
                <Texto category="p1" style={{ fontWeight: "600" }}>
                  {project.name}
                </Texto>
              </Vertical>
              <div style={{ flex: 2 }}>
                <ManyTag tagItems={project.technologies} maxCount={3} />
              </div>
            </Horizontal>
          ))}
        </div>
      </Vertical>

      {/* Categorized Display */}
      <Texto category="h5">Categorized Tags</Texto>
      <Vertical className="mb-4">
        <Horizontal gap={20} style={{ flexWrap: "wrap" }}>
          <Card title="Frontend Technologies" size="small" style={{ width: 300 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CodeOutlined style={{ color: "var(--theme-success)" }} />
              <ManyTag tagItems={["React", "Vue", "Angular", "Svelte"]} maxCount={3} />
            </div>
          </Card>

          <Card title="Backend Technologies" size="small" style={{ width: 300 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <DatabaseOutlined style={{ color: "var(--theme-warning)" }} />
              <ManyTag tagItems={["Node.js", "Python", "Java", "Go"]} maxCount={3} />
            </div>
          </Card>

          <Card title="Cloud Platforms" size="small" style={{ width: 300 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CloudOutlined style={{ color: "var(--theme-error)" }} />
              <ManyTag tagItems={["AWS", "Azure", "GCP", "Vercel"]} maxCount={2} />
            </div>
          </Card>
        </Horizontal>
      </Vertical>

      {/* Multi-Select Integration */}
      <Texto category="h5">Multi-Select Integration</Texto>
      <Vertical className="mb-4">
        <Card title="Category Selector" style={{ maxWidth: "600px" }}>
          <Select
            mode="multiple"
            value={selectedCategories}
            onChange={setSelectedCategories}
            placeholder="Select categories"
            style={{ width: "100%", marginBottom: "16px" }}
            options={[
              { label: "Frontend", value: "Frontend" },
              { label: "Backend", value: "Backend" },
              { label: "DevOps", value: "DevOps" },
              { label: "Database", value: "Database" },
              { label: "Mobile", value: "Mobile" },
              { label: "Testing", value: "Testing" },
            ]}
          />
          <Texto category="p2" className="mb-2">Selected Categories:</Texto>
          <ManyTag tagItems={selectedCategories} maxCount={4} />
        </Card>
      </Vertical>

      {/* Real-world Examples */}
      <Texto category="h5">Real-world Examples</Texto>
      <Vertical className="mb-4">
        <Horizontal gap={20} style={{ flexWrap: "wrap" }}>
          {/* User Profile Simulation */}
          <Card title="User Profile" size="small" style={{ width: 300 }}>
            <Horizontal className="mb-2" verticalCenter>
              <UserOutlined style={{ marginRight: "8px", color: "var(--theme-color-2)" }} />
              <Texto category="p1" style={{ fontWeight: "600" }}>John Developer</Texto>
            </Horizontal>
            <Texto category="p2" className="mb-2">Roles:</Texto>
            <ManyTag tagItems={["Admin", "Developer", "Team Lead"]} maxCount={2} />
            <Texto category="p2" className="mb-2 mt-3">Skills:</Texto>
            <ManyTag tagItems={["React", "Node.js", "TypeScript", "AWS", "Docker"]} maxCount={3} />
          </Card>

          {/* Project Card Simulation */}
          <Card title="Project Overview" size="small" style={{ width: 300 }}>
            <Texto category="p1" className="mb-2" style={{ fontWeight: "600" }}>
              E-commerce Platform
            </Texto>
            <Texto category="p2" className="mb-2">Technologies:</Texto>
            <ManyTag
              tagItems={["React", "Node.js", "MongoDB", "Redis", "AWS", "Stripe", "Docker"]}
              maxCount={4}
            />
            <Texto category="p2" className="mb-2 mt-3">Team:</Texto>
            <ManyTag tagItems={["Alice", "Bob", "Charlie", "Diana", "Eve"]} maxCount={3} />
          </Card>
        </Horizontal>
      </Vertical>

      {/* Performance Demonstration */}
      <Texto category="h5">Large Dataset Handling</Texto>
      <Vertical className="mb-4">
        <Card title="100+ Items Performance Test" style={{ maxWidth: "600px" }}>
          <Texto category="p2" className="mb-2">
            Displaying 5 items from a dataset of 100+ technologies:
          </Texto>
          <ManyTag
            tagItems={Array.from({ length: 100 }, (_, i) => `Technology-${i + 1}`)}
            maxCount={5}
          />
          <Texto category="p2" className="mt-2" style={{ color: "var(--theme-color-3)" }}>
            ManyTag efficiently handles large datasets by only rendering visible items.
          </Texto>
        </Card>
      </Vertical>
    </Vertical>
  );
}