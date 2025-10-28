import ELK from 'elkjs/lib/elk.bundled.js';
import type { Node as FlowNode } from "@xyflow/react";

interface QueueItem {
  key: string;
  value: unknown;
  parentId: string | undefined;
  id: string;
}

interface CustomNode extends FlowNode {
  parentId?: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

let idCounter = 0;

const elk = new ELK();

const elkOptions = {
  'elk.algorithm': 'mrtree',
  'elk.direction': 'DOWN',
  'nodePlacement.strategy': 'SIMPLE',
};

export const jsonToNodes = async (
  json: string
): Promise<{ nodes: FlowNode[]; edges: Edge[] }> => {
  json = JSON.parse(json);
  idCounter = 0;

  const nodes: CustomNode[] = [];
  const edges: Edge[] = [];
  const queue: QueueItem[] = [];

  const getId = () => `node_${idCounter++}`;

  const rootId = getId();

  queue.push({
    key: "root",
    value: json,
    parentId: undefined,
    id: rootId,
  });

  while (queue.length > 0) {
    const item = queue.shift();
    if (!item) continue;

    const { key, value, parentId, id } = item;

    const label =
      typeof value === "object" && value !== null ? key : `${key}: ${value}`;

    nodes.push({
      id,
      data: { label },
      position: { x: 0, y: 0 }, // Will update this after   layout
      type: "default",
      sourcePosition: "bottom", 
      targetPosition: "top", 
      ...(parentId ? { parentId } : {}),
    });

    if (parentId) {
      const edgeId = `e_${parentId}-${id}`;
      edges.push({
        id: edgeId,
        source: parentId,
        target: id,
      });
    }

    if (typeof value === "object" && value !== null) {
      for (const childKey in value as any) {
        const childValue = (value as any)[childKey];
        const childId = getId();

        queue.push({
          key: childKey,
          value: childValue,
          parentId: id,
          id: childId,
        });
      }
    }
  }

  const graph = {
    id: 'root',
    layoutOptions: elkOptions,
    children: nodes.map(node => ({ ...node, width: 150, height: 50 })),
    edges: edges,
  };

  const layout = await elk.layout(graph);

  const positionedNodes = nodes.map((node) => {
    const nodeWithPos = layout.children.find(child => child.id === node.id);
    if (nodeWithPos) {
      return {
        ...node,
        position: {
          x: nodeWithPos.x,
          y: nodeWithPos.y,
        },
      };
    }
    return node;
  });

  return { nodes: positionedNodes, edges };
};
