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
      const getLayoutedElements = async () => {
        const { nodes: newNodes, edges: newEdges } =
          await jsonToNodes(activeJson);
        setNodes(newNodes);
        setEdges(newEdges);
      };
      getLayoutedElements();
    }
  }, [activeJson, setNodes, setEdges]);

  return (
    <div className="w-[100%] h-[calc(100vh-40px)] bg-white rounded-[20px] border-r-[5px] border-gray-600 ">
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
