"use client";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect } from "react";
import { useJsonContext } from "./../contexts/JsonContext"; 

import { jsonToNodes } from "./utils";

const Reactflowmain = () => {
  const { activeJson, validJson, setValidJson } = useJsonContext();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Convert JSON to nodes and edges whenever activeJson changes
  useEffect(() => {
    if (activeJson && validJson) {
      const { nodes: newNodes, edges: newEdges } = jsonToNodes(activeJson);
      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [activeJson, setNodes, setEdges]);

  return (
    <div className="w-[100%] h-[100vh]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default Reactflowmain;
