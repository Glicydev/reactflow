"use client";

import { MouseEvent, useCallback, useState } from "react";
import CustomNode from "./CustomNode";
import Button from "./Button";
import ContextMenu from "./ContextMenu";
import {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  useEdgesState,
  useNodesState,
  ReactFlow,
  NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes = [
  {
    id: "1",
    data: { label: "Input Node 1" },
    position: { x: 0, y: 0 },
    type: "label",
  },
] satisfies Node[];

const nodeTypes = {
  label: CustomNode,
} satisfies NodeTypes;

interface ICoordinates {
  x: number;
  y: number;
}

export default function ReactFlowComponent() {
  // States
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);

  const [id, setId] = useState(2);

  const [menuOpened, setMenuOpened] = useState<boolean>(false);
  const [menuCoor, setMenuCoor] = useState<ICoordinates>({ x: 0, y: 0 });

  // Utils
  const selectedNodes = () => {
    return nodes.filter((node: Node) => node.selected);
  };

  const selectedEdges = () => {
    return edges.filter((edge: Edge) => edge.selected);
  };


  const selectNode = (node: Node) => {
    setNodes((nds) => nds.map((n) =>
      n.id === node.id ? { ...n, selected: true } : n));
  };

  const selectNodeOnly = (node: Node) => {
    setNodes((nds) => nds.map((n) =>
      ({ ...n, selected: n.id === node.id })));
  };

  const selectEdge = (edge: Edge) => {
    setEdges((edges: Edge[]) =>
      edges.map((e: Edge) => e.id === edge.id ? { ...e, selected: true } : e));
  };

  // Callbacks & events
  const onConnect = useCallback(
    (params: Connection) => setEdges((edge) => addEdge(params, edge)),
    [setEdges]
  );

  const onAdd = () => {
    setId((id) => id + 1);

    const newNode = {
      id: id.toString(),
      data: { label: `Input Node ${id}` },
      position: { x: 0, y: 0 },
      type: "label",
    } satisfies Node;

    setNodes((nodes) => nodes.concat(newNode));
    selectNodeOnly(newNode);
  };

  const onContextMenu = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();

      setMenuCoor({
        x: e.clientX,
        y: e.clientY,
      });

      setMenuOpened(true);
    },
    [setNodes]
  );

  const onNodeContextMenu = useCallback(
    (e: MouseEvent, node: Node) => {
      e.preventDefault();

      onContextMenu(e);
      selectNode(node);
    },
    [onContextMenu, setNodes]
  );

  const onEdgeContextMenu = useCallback(
    (e: MouseEvent, edge: Edge) => {
      e.preventDefault();

      onContextMenu(e);
      selectEdge(edge);
    },
    [onContextMenu, selectEdge]
  );

  const onClickDelete = () => {
    const selectedNodesList = selectedNodes();
    const selectedEdgesList = selectedEdges();

    if (!selectedNodesList.length && !selectedEdgesList.length) return;

    setEdges((edges) =>
      edges.filter(
        (edge: Edge) =>
          !selectedEdgesList.find((selEdge: Edge) => selEdge.id === edge.id)
      )
    );

    selectedNodesList.forEach((selectedNode) => {
      setNodes((nodes) => nodes.filter((node) => node.id !== selectedNode.id));

      setEdges((edges) =>
        edges.filter(
          (edge: Edge) =>
            edge.source !== selectedNode.id && edge.target !== selectedNode.id
        )
      );
    });

    setMenuOpened(false);
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      onContextMenu={onContextMenu}
      onNodeContextMenu={onNodeContextMenu}
      onEdgeContextMenu={onEdgeContextMenu}
      defaultEdgeOptions={{
        type: "custom-edge",
        label: "Edge",
        animated: true,
      }}
      onClick={() => setMenuOpened(false)}
      colorMode="dark"
      fitView
    >
      <Background />
      <div className="absolute backdrop-blur-[1px] left-1/2 bottom-8 -translate-x-1/2 flex justify-between gap-2 z-10 p-2 py-1 border border-neutral-800 rounded-full bg-neutral-900/50">
        <Button
          onClick={onAdd}
          classname="w-11 px-0! aspect-square rounded-full"
          text="+"
        />
        <Button
          onClick={onClickDelete}
          classname="rounded-full"
          text="Supprimer"
        />
      </div>
      <MiniMap position="bottom-right" />
      <Controls />
      <ContextMenu
        isOpened={menuOpened}
        x={menuCoor.x}
        y={menuCoor.y}
        onClose={() => setMenuOpened(false)}
      >
        <li onClick={onClickDelete}>🗑️ Supprimer</li>
        <li onClick={onClickDelete}>🗑️ Supprimer 2</li>
      </ContextMenu>
    </ReactFlow>
  );
}
