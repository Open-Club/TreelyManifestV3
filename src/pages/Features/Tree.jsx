import React, { useState } from "react"
import { Tree } from "antd"
import dummyData from "./dummyData/fakeData"
import TabTitle from "./util/TabTitle"
import NewTab from "./util/NewTab"

const antdTree = () => {
  const styles = {
    treeOuterWrapper: {

    },
    seperationLine: {
      margin: "0 10px 5px 10px"
    },
    newTabWrapper: {
      margin: "0"
    }
  }
  const [treeInfo, setTreeInfo] = useState(dummyData)
  const { TreeNode } = Tree;
  //setTreeInfo(dummyData);

  const loop = (data) => data.map((item) => {
    let render;
    if (item.children && item.children.length > 0) {
      render = <TreeNode {...item} key={item.key} title={<TabTitle item={item} />} >{loop(item.children)}</TreeNode>;

    } else {
      render = <TreeNode {...item} key={item.key} title={<TabTitle item={item} />} />;
    }
    return render;
  });

  const titleRender = item => <TabTitle key={item.key} item={item} />
  return (
    <div
      id={"treely_tree"}
      style={styles.treeOuterWrapper}

    >
      <div  // style={styles.pinWrapper}
      >
        {
          /*
          <PinGrids
          info={props.info}
          treeInfo={treeInfo}
          setTreeInfo={setTreeInfo}
          settings={props.mainSettings.settings}
          resize={props.resize}
          query={query}
          windowsActive={props.windowsActive}
        />
          */
        }

      </div>

      <div style={styles.treeWrapper}>
        <Tree
          virtual
          //multiple
          showIcon
          //autoExpandParent={queryActive ? true : false}
          //selectedKeys={treeInfo.selectedKeys}
          //expandedKeys={queryActive ? queryExpandedKeys : treeInfo.expandedKeys}
          //expandedKeys={treeInfo.expandedKeys}
          className="draggable-tree"
          blockNode
          draggable={true}
          //onExpand={onExpand}
          //onDrop={onDrop}
          //onSelect={onDelete}
          //onRightClick={onRightClick}
          treeData={treeInfo.treeData}
          titleRender={titleRender}
        />

        {
          /*

          <ContextMenu
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          info={props.info}
          treeInfo={treeInfo}
          settings={props.mainSettings.settings}
        />
          */
        }


      </div>
      <hr style={styles.seperationLine} />
      <div style={styles.newTabWrapper}>
        <NewTab />
      </div>


      {/**
       * Debugger
       <div style={{ display: "none" }}>
        <button onClick={randomTreeHandler}>
          Random tree
          </button>
      </div>

      <div style={{ display: "none" }}>
        <button onClick={showPinnedHandler}>
          Show pinned
          </button>
      </div>

      <div style={{ display: "none" }}>
        <button onClick={showTreeDataHandler}>
          Show treeData
          </button>
      </div>
      <div style={{ display: "none" }}>
        <button onClick={showTreeInfoHandler}>
          Show all
          </button>
      </div>

      <div style={{ display: "none" }}>
        <button
          onClick={discard}>
          Discard
          </button>
      </div>

       */
      }



    </div>
  );

}

export default antdTree;
