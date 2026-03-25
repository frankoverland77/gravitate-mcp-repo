/**
 * ManyTag Component Examples Database
 *
 * This file contains production-tested examples of the ManyTag component
 * extracted from the Excalibrr component library. These examples range from
 * simple to complex implementations, covering various use cases and patterns.
 *
 * Used by the MCP server to generate high-quality ManyTag implementations.
 */

export interface ManyTagExample {
  id: string
  name: string
  description: string
  complexity: 'simple' | 'medium' | 'complex'
  category?: string
  tags: string[]
  code: string
  props: Record<string, any>
  dependencies?: string[]
  notes?: string
  sourceFile?: string
}

export const ManyTagExamples: ManyTagExample[] = [
  {
    id: 'many_tag_simple_01',
    name: 'Basic User Roles Display',
    description: 'Simple ManyTag for displaying user roles with overflow',
    complexity: 'simple',
    category: 'user-interface',
    tags: ['roles', 'user-profile', 'basic', 'overflow'],
    code: `<ManyTag tagItems={securityContext.Roles} maxCount={2} />`,
    props: {
      tagItems: 'Array of role strings',
      maxCount: 'Number - Maximum tags to display before showing "+N more"'
    },
    dependencies: ['@gravitate-js/excalibrr'],
    sourceFile: 'src/components/shared/Navigation/ControlPanel/ControlPanel.jsx',
    notes: 'Perfect for user profile sections where roles need to be displayed with overflow handling'
  },

  {
    id: 'many_tag_simple_02',
    name: 'Product Tags Display',
    description: 'Basic ManyTag for displaying product categories or tags',
    complexity: 'simple',
    category: 'data-display',
    tags: ['products', 'categories', 'display', 'simple'],
    code: `const productTags = ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Database']

<ManyTag tagItems={productTags} maxCount={3} />`,
    props: {
      tagItems: 'Array of product category strings',
      maxCount: 'Number - Display limit with overflow indicator'
    },
    dependencies: ['@gravitate-js/excalibrr'],
    notes: 'Ideal for product cards, category lists, or skill displays'
  },

  {
    id: 'many_tag_medium_01',
    name: 'Grid Cell Multi-Select Renderer',
    description: 'ManyTag used as cell renderer for multi-select data in grids',
    complexity: 'medium',
    category: 'grid-integration',
    tags: ['grid', 'cell-renderer', 'multi-select', 'products'],
    code: `cellRenderer: ({ value }) => {
  const tagItems = value?.map((id) => {
    return metadata?.Products.find((p) => p.Value === id)?.Text
  })
  return <ManyTag tagItems={tagItems} maxCount={5} />
}`,
    props: {
      tagItems: 'Transformed array from IDs to display names',
      maxCount: 'Higher count (5) for grid cells with more space'
    },
    dependencies: ['@gravitate-js/excalibrr', 'ag-grid-community'],
    sourceFile: 'src/modules/Admin/Integrations/AllocationMappings/Tabs/Products/columnDefs.tsx',
    notes: 'Essential pattern for grid cells displaying multi-select associations with proper data transformation'
  },

  {
    id: 'many_tag_medium_02',
    name: 'User Roles with Value Transformation',
    description: 'ManyTag displaying user roles with complex object-to-string transformation',
    complexity: 'medium',
    category: 'data-transformation',
    tags: ['roles', 'transformation', 'objects', 'grid'],
    code: `cellRenderer: ({ value }) => {
  return <ManyTag tagItems={value?.map((item) => item.Name)} maxCount={5} />
}`,
    props: {
      tagItems: 'Array mapped from objects to extract Name property',
      maxCount: 'Standard grid display limit'
    },
    dependencies: ['@gravitate-js/excalibrr'],
    sourceFile: 'src/modules/Admin/ManageUsers/components/colDefs.tsx',
    notes: 'Common pattern for displaying object arrays by extracting display properties'
  },

  {
    id: 'many_tag_complex_01',
    name: 'Price Types with Sorting and Lookup',
    description: 'Advanced ManyTag with data lookup, sorting, and complex value transformation',
    complexity: 'complex',
    category: 'advanced-data',
    tags: ['price-types', 'lookup', 'sorting', 'complex-transform'],
    code: `cellRenderer: (props) => (
  <ManyTag
    tagItems={props?.value
      ?.map((v) => priceTypes?.CodeValues?.find((cv) => cv?.CodeValueId === v?.PriceTypeCvId)?.Display)
      .sort()}
    maxCount={5}
  />
)`,
    props: {
      tagItems: 'Complex transformation with lookup and sorting',
      maxCount: 'Balanced display limit for complex data'
    },
    dependencies: ['@gravitate-js/excalibrr'],
    sourceFile: 'src/modules/Admin/PricePublishers/columnDefs.tsx',
    notes: 'Advanced pattern combining data lookup, transformation, and sorting for professional data display'
  },

  {
    id: 'many_tag_complex_02',
    name: 'Dynamic Skills with Add/Remove',
    description: 'Interactive ManyTag with dynamic add/remove functionality',
    complexity: 'complex',
    category: 'interactive',
    tags: ['skills', 'interactive', 'dynamic', 'add-remove'],
    code: `const [skills, setSkills] = useState(['React', 'TypeScript', 'Node.js'])
const [newSkill, setNewSkill] = useState('')

const addSkill = () => {
  if (newSkill && !skills.includes(newSkill)) {
    setSkills([...skills, newSkill])
    setNewSkill('')
  }
}

const removeSkill = (skillToRemove) => {
  setSkills(skills.filter(skill => skill !== skillToRemove))
}

<div>
  <ManyTag tagItems={skills} maxCount={4} />
  <Input
    value={newSkill}
    onChange={(e) => setNewSkill(e.target.value)}
    onPressEnter={addSkill}
    placeholder="Add new skill"
  />
  <Button onClick={addSkill}>Add Skill</Button>
</div>`,
    props: {
      tagItems: 'Dynamic array managed by state',
      maxCount: 'Moderate limit for user interface'
    },
    dependencies: ['@gravitate-js/excalibrr', 'antd', 'react'],
    notes: 'Full interactive pattern for user-managed tag collections with add/remove functionality'
  },

  {
    id: 'many_tag_complex_03',
    name: 'Filtered Tags with Search',
    description: 'ManyTag with search filtering and highlight functionality',
    complexity: 'complex',
    category: 'search-filter',
    tags: ['search', 'filter', 'highlight', 'advanced'],
    code: `const [searchTerm, setSearchTerm] = useState('')
const allTags = ['React', 'Vue', 'Angular', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java']

const filteredTags = useMemo(() => {
  if (!searchTerm) return allTags
  return allTags.filter(tag =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  )
}, [searchTerm, allTags])

<div>
  <Input
    placeholder="Search technologies..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{ marginBottom: 16 }}
  />
  <ManyTag
    tagItems={filteredTags}
    maxCount={searchTerm ? 10 : 5}
  />
</div>`,
    props: {
      tagItems: 'Filtered array based on search term',
      maxCount: 'Dynamic count - higher when searching'
    },
    dependencies: ['@gravitate-js/excalibrr', 'antd', 'react'],
    notes: 'Advanced pattern combining search functionality with dynamic tag display and responsive maxCount'
  }
]

export default ManyTagExamples