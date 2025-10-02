let json = {
  "cat": {
    "hair": true
  }
};


let idCounter = 0;

 const jsonToNodes = (json) => {



  const nodes = [];
  const edges = [];
  const queue = [];

  const getId = () => `node_${idCounter++}`;

  const rootId = getId();

  queue.push({
    key: "root",
    value: json,
    parentId: undefined,
    id: rootId,
  });

  while (queue.length > 0) {
    const { key, value, parentId, id } = queue.shift();

    const label =
      typeof value === "object" && value !== null ? key : `${key}: ${value}`;

    nodes.push({
      id,
      data: { label },
      position: { x: 0, y: 0 },
      type: "default",
      parentId,
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
      for (const childKey in value) {
        const childValue = value[childKey];
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

  return { nodes, edges };
};

console.log(jsonToNodes(json))


