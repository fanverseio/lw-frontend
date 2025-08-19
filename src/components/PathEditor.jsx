import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { pathService } from "./../services/pathService";
import { useParams, useNavigate } from "react-router-dom";

// dummy nodes and edges
/*
const initialNodes = [
  {
    id: "n1",
    position: { x: 0, y: 0 },
    data: {
      label: "Node 1",
      content:
      "This is the detailed content for Node 1. You can add learning materials, links, or instructions here.",
    },
  },
  {
    id: "n2",
    position: { x: 0, y: 100 },
    data: {
      label: "Node 2",
      content: "Node 2 detailed content goes here...",
    },
  },
  {
    id: "n3",
    position: { x: 200, y: 50 },
    data: {
      label: "Node 3",
      content: "Node 3 content and learning materials...",
    },
  },
];
*/

const initialEdges = [
  { id: "n1-n2", source: "n1", target: "n2" },
  { id: "n2-n3", source: "n2", target: "n3" },
];

function PathEditor() {
  const { id: pathId } = useParams();
  const navigate = useNavigate();

  // const [nodes, setNodes] = useState(initialNodes);
  // const [edges, setEdges] = useState(initialEdges);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editingNode, setEditingNode] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadPathData();
  }, [pathId]);

  const loadPathData = async () => {
    if (!pathId) return;
    try {
      setIsLoading(true);
      const data = await pathService.getPathData(token, pathId);
      setNodes(data.nodes?.length > 0 ? data.nodes : initialNodes);
      setEdges(data.edges?.length > 0 ? data.edges : initialEdges);
    } catch (error) {
      console.error("Error loading path data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePathData = async () => {
    if (!pathId) return;
    try {
      setIsSaving(true);
      await pathService.updatePathData(token, pathId, nodes, edges);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Error saving path data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // auto-save
  useEffect(() => {
    if (!isLoading && pathId) {
      const timeoutId = setTimeout(() => {
        savePathData();
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [nodes, edges, isLoading, pathId]);

  const onAddNode = useCallback(() => {
    const newNodeId = `n${nodes.length + 1}`;
    const newNode = {
      id: newNodeId,
      position: {
        x: Math.random() * 300,
        y: Math.random() * 300,
      },
      data: {
        label: `Node ${nodes.length + 1}`,
        content: "Add your learning content here...",
      },
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
  }, [nodes.length, setNodes]);

  const onNodeContextMenu = useCallback(
    (event, node) => {
      event.preventDefault();

      if (window.confirm(`Delete "${node.data.label}"?`)) {
        setNodes((nds) => nds.filter((n) => n.id !== node.id));
        setEdges((eds) =>
          eds.filter((e) => e.source !== node.id && e.target !== node.id)
        );
      }
    },
    [setNodes, setEdges]
  );

  const onNodeDoubleClick = useCallback((event, node) => {
    setEditingNode(node.id);
    setEditTitle(node.data.label);
    setEditContent(node.data.content || "");
  }, []);

  const saveNodeEdit = useCallback(() => {
    if (editingNode && editTitle.trim()) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === editingNode
            ? {
                ...node,
                data: {
                  ...node.data,
                  label: editTitle.trim(),
                  content: editContent.trim(),
                },
              }
            : node
        )
      );
    }
    setEditingNode(null);
    setEditTitle("");
    setEditContent("");
  }, [editingNode, editTitle, editContent, setNodes]);

  const cancelEdit = useCallback(() => {
    setEditingNode(null);
    setEditTitle("");
    setEditContent("");
  }, []);

  const onDownloadAsJSON = useCallback(() => {
    const data = {
      nodes,
      edges,
      exportedAt: new Date().toISOString(),
      nodeCount: nodes.length,
      edgeCount: edges.length,
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `learner-weave-${new Date().toISOString().slice(0, 16)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading path data...</div>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {/* Each path UI */}

      <div className="absolute top-4 left-4 z-10 bg-white p-2 rounded shadow-lg border">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={handleBackToDashboard}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
          >
            ← Back to Dashboard
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            🌐 Public Paths
          </button>
        </div>
        <button
          onClick={onAddNode}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
        >
          + Add Node
        </button>
        <button
          onClick={onDownloadAsJSON}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          ↓ Download JSON
        </button>
        <div className="text-xs text-gray-500 mt-1">
          Right-click nodes to delete
        </div>
        <div className="text-xs text-gray-500 mt-1">Double-click to edit</div>
        {lastSaved && (
          <span className="text-xs text-green-600">
            Saved {lastSaved.toLocaleTimeString()}
          </span>
        )}
        {isSaving && <span className="text-xs text-blue-600">Saving...</span>}
      </div>

      {/* Each node - Right Sidebar for Editing */}
      {editingNode && (
        <>
          {/* Sliding Sidebar */}
          <div
            className="absolute right-0 top-0 h-full w-96
  bg-white shadow-2xl z-20 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b bg-gray-50">
              <div
                className="flex justify-between
  items-center"
              >
                <h2
                  className="text-xl font-bold
  text-gray-800"
                >
                  Edit Node
                </h2>
                <button
                  onClick={cancelEdit}
                  className="text-gray-500 hover:text-gray-700
  text-xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              {/* Title Field */}
              <div className="mb-6">
                <label
                  className="block text-sm font-medium
  text-gray-700 mb-2"
                >
                  Node Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300
  rounded-lg focus:ring-2 focus:ring-blue-500
  focus:border-blue-500"
                  placeholder="Enter node title"
                  autoFocus
                />
              </div>

              {/* Content Field */}
              <div className="mb-6">
                <label
                  className="block text-sm font-medium
  text-gray-700 mb-2"
                >
                  Content & Description
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={8}
                  className="w-full p-3 border border-gray-300
  rounded-lg focus:ring-2 focus:ring-blue-500
  focus:border-blue-500"
                  placeholder="Add learning materials,
  instructions, links, or any detailed content..."
                />
              </div>
            </div>

            {/* Footer buttons */}
            <div className="p-6 border-t bg-gray-50">
              <div className="flex gap-3">
                <button
                  onClick={saveNodeEdit}
                  className="flex-1 bg-blue-500
  hover:bg-blue-600 text-white font-medium py-3 px-4
  rounded-lg transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex-1 bg-gray-500
  hover:bg-gray-600 text-white font-medium py-3 px-4
  rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeContextMenu={onNodeContextMenu}
        onNodeDoubleClick={onNodeDoubleClick}
        fitView
      />
    </div>
  );
}

export default PathEditor;
