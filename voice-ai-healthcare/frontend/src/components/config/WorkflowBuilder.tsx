import React, { useState } from 'react';
import { Plus, Save, Play, Trash2, Copy } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface WorkflowNode {
  id: string;
  type: 'greeting' | 'question' | 'decision' | 'action' | 'api' | 'transfer' | 'end';
  label: string;
  config: any;
  position: { x: number; y: number };
  connections: string[];
}

interface WorkflowBuilderProps {
  workflowId?: string;
  onSave?: (nodes: WorkflowNode[]) => void;
  onTest?: (nodes: WorkflowNode[]) => void;
}

export default function WorkflowBuilder({ workflowId, onSave, onTest }: WorkflowBuilderProps) {
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: '1',
      type: 'greeting',
      label: 'Welcome Message',
      config: { message: 'Hello, how can I help you today?' },
      position: { x: 100, y: 100 },
      connections: ['2'],
    },
    {
      id: '2',
      type: 'question',
      label: 'Ask Reason',
      config: { question: 'What can I help you with?' },
      position: { x: 100, y: 250 },
      connections: ['3'],
    },
  ]);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [showNodeMenu, setShowNodeMenu] = useState(false);

  const nodeTypes = [
    { type: 'greeting', label: 'Greeting', color: colors.primary[500], icon: '👋' },
    { type: 'question', label: 'Question', color: colors.status.success, icon: '❓' },
    { type: 'decision', label: 'Decision', color: colors.status.warning, icon: '🔀' },
    { type: 'action', label: 'Action', color: colors.primary[600], icon: '⚡' },
    { type: 'api', label: 'API Call', color: colors.status.error, icon: '🔌' },
    { type: 'transfer', label: 'Transfer', color: colors.neutral[600], icon: '📞' },
    { type: 'end', label: 'End Call', color: colors.neutral[900], icon: '🏁' },
  ];

  const getNodeType = (type: string) => {
    return nodeTypes.find((nt) => nt.type === type) || nodeTypes[0];
  };

  const handleAddNode = (type: string) => {
    const newNode: WorkflowNode = {
      id: Date.now().toString(),
      type: type as any,
      label: `New ${type}`,
      config: {},
      position: { x: 300, y: 200 },
      connections: [],
    };

    setNodes([...nodes, newNode]);
    setSelectedNode(newNode.id);
    setShowNodeMenu(false);
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes(nodes.filter((n) => n.id !== nodeId));
    setSelectedNode(null);
  };

  const handleDuplicateNode = (nodeId: string) => {
    const nodeToDuplicate = nodes.find((n) => n.id === nodeId);
    if (!nodeToDuplicate) return;

    const newNode: WorkflowNode = {
      ...nodeToDuplicate,
      id: Date.now().toString(),
      position: {
        x: nodeToDuplicate.position.x + 50,
        y: nodeToDuplicate.position.y + 50,
      },
      connections: [],
    };

    setNodes([...nodes, newNode]);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(nodes);
    }
  };

  const handleTest = () => {
    if (onTest) {
      onTest(nodes);
    }
  };

  const selectedNodeData = selectedNode ? nodes.find((n) => n.id === selectedNode) : null;

  return (
    <div
      style={{
        border: `1px solid ${colors.neutral[200]}`,
        borderRadius: '8px',
        backgroundColor: 'white',
        height: '800px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          padding: spacing[4],
          borderBottom: `1px solid ${colors.neutral[200]}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
          Workflow Builder
        </h3>

        <div style={{ display: 'flex', gap: spacing[2] }}>
          <button
            onClick={() => setShowNodeMenu(!showNodeMenu)}
            style={{
              padding: `${spacing[2]} ${spacing[4]}`,
              backgroundColor: colors.primary[500],
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            Add Node
          </button>

          <button
            onClick={handleTest}
            style={{
              padding: `${spacing[2]} ${spacing[4]}`,
              backgroundColor: 'white',
              color: colors.primary[500],
              border: `1px solid ${colors.primary[500]}`,
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}
          >
            <Play style={{ width: '16px', height: '16px' }} />
            Test
          </button>

          <button
            onClick={handleSave}
            style={{
              padding: `${spacing[2]} ${spacing[4]}`,
              backgroundColor: colors.status.success,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}
          >
            <Save style={{ width: '16px', height: '16px' }} />
            Save
          </button>
        </div>

        {/* Node Menu */}
        {showNodeMenu && (
          <div
            style={{
              position: 'absolute',
              top: '70px',
              right: spacing[4],
              backgroundColor: 'white',
              border: `1px solid ${colors.neutral[200]}`,
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 1000,
              padding: spacing[2],
              minWidth: '200px',
            }}
          >
            {nodeTypes.map((nodeType) => (
              <button
                key={nodeType.type}
                onClick={() => handleAddNode(nodeType.type)}
                style={{
                  width: '100%',
                  padding: spacing[3],
                  border: 'none',
                  backgroundColor: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[2],
                  fontSize: typography.fontSize.sm,
                }}
                className="node-menu-item"
              >
                <span style={{ fontSize: '20px' }}>{nodeType.icon}</span>
                {nodeType.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Canvas & Properties Split */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Canvas */}
        <div
          style={{
            flex: 1,
            backgroundColor: colors.neutral[50],
            backgroundImage: `radial-gradient(${colors.neutral[300]} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            position: 'relative',
            overflow: 'auto',
          }}
        >
          {/* Nodes */}
          {nodes.map((node) => {
            const nodeType = getNodeType(node.type);
            const isSelected = selectedNode === node.id;

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                style={{
                  position: 'absolute',
                  left: `${node.position.x}px`,
                  top: `${node.position.y}px`,
                  width: '180px',
                  padding: spacing[4],
                  backgroundColor: 'white',
                  border: `2px solid ${isSelected ? nodeType.color : colors.neutral[200]}`,
                  borderRadius: '8px',
                  boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 4px rgba(0,0,0,0.1)',
                  cursor: 'move',
                  transition: 'all 0.2s',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[2],
                    marginBottom: spacing[2],
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{nodeType.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: typography.fontSize.xs,
                        color: colors.neutral[600],
                        marginBottom: spacing[0.5],
                      }}
                    >
                      {nodeType.label}
                    </div>
                    <div
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {node.label}
                    </div>
                  </div>
                </div>

                {/* Connection Points */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: nodeType.color,
                    border: '3px solid white',
                    cursor: 'pointer',
                  }}
                  title="Connect to next node"
                />
              </div>
            );
          })}

          {/* Empty State */}
          {nodes.length === 0 && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: colors.neutral[500],
              }}
            >
              <div style={{ fontSize: '64px', marginBottom: spacing[4] }}>🎯</div>
              <div style={{ fontSize: typography.fontSize.lg, marginBottom: spacing[2] }}>
                Start Building Your Workflow
              </div>
              <div style={{ fontSize: typography.fontSize.sm }}>
                Click "Add Node" to begin
              </div>
            </div>
          )}
        </div>

        {/* Properties Panel */}
        {selectedNodeData && (
          <div
            style={{
              width: '320px',
              borderLeft: `1px solid ${colors.neutral[200]}`,
              backgroundColor: 'white',
              padding: spacing[4],
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: spacing[4],
              }}
            >
              <h4 style={{ fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semibold }}>
                Node Properties
              </h4>

              <div style={{ display: 'flex', gap: spacing[1] }}>
                <button
                  onClick={() => handleDuplicateNode(selectedNode!)}
                  style={{
                    padding: spacing[2],
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    borderRadius: '4px',
                  }}
                  title="Duplicate"
                >
                  <Copy style={{ width: '16px', height: '16px', color: colors.neutral[600] }} />
                </button>
                <button
                  onClick={() => handleDeleteNode(selectedNode!)}
                  style={{
                    padding: spacing[2],
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    borderRadius: '4px',
                  }}
                  title="Delete"
                >
                  <Trash2 style={{ width: '16px', height: '16px', color: colors.status.error }} />
                </button>
              </div>
            </div>

            {/* Node Label */}
            <div style={{ marginBottom: spacing[4] }}>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  marginBottom: spacing[2],
                }}
              >
                Label
              </label>
              <input
                type="text"
                value={selectedNodeData.label}
                onChange={(e) => {
                  setNodes(
                    nodes.map((n) =>
                      n.id === selectedNode ? { ...n, label: e.target.value } : n
                    )
                  );
                }}
                style={{
                  width: '100%',
                  padding: spacing[2],
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                }}
              />
            </div>

            {/* Type-specific configuration */}
            {selectedNodeData.type === 'greeting' && (
              <div style={{ marginBottom: spacing[4] }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    marginBottom: spacing[2],
                  }}
                >
                  Message
                </label>
                <textarea
                  value={selectedNodeData.config.message || ''}
                  onChange={(e) => {
                    setNodes(
                      nodes.map((n) =>
                        n.id === selectedNode
                          ? { ...n, config: { ...n.config, message: e.target.value } }
                          : n
                      )
                    );
                  }}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: spacing[2],
                    border: `1px solid ${colors.neutral[300]}`,
                    borderRadius: '6px',
                    fontSize: typography.fontSize.sm,
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
              </div>
            )}

            {selectedNodeData.type === 'question' && (
              <div style={{ marginBottom: spacing[4] }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    marginBottom: spacing[2],
                  }}
                >
                  Question
                </label>
                <textarea
                  value={selectedNodeData.config.question || ''}
                  onChange={(e) => {
                    setNodes(
                      nodes.map((n) =>
                        n.id === selectedNode
                          ? { ...n, config: { ...n.config, question: e.target.value } }
                          : n
                      )
                    );
                  }}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: spacing[2],
                    border: `1px solid ${colors.neutral[300]}`,
                    borderRadius: '6px',
                    fontSize: typography.fontSize.sm,
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
              </div>
            )}

            {/* Connection Info */}
            <div style={{ marginTop: spacing[6], paddingTop: spacing[4], borderTop: `1px solid ${colors.neutral[200]}` }}>
              <div
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  marginBottom: spacing[2],
                }}
              >
                Connections
              </div>
              <div
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.neutral[600],
                }}
              >
                {selectedNodeData.connections.length > 0
                  ? `Connected to ${selectedNodeData.connections.length} node(s)`
                  : 'No connections'}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .node-menu-item:hover {
          background-color: ${colors.primary[50]};
        }
      `}</style>
    </div>
  );
}
