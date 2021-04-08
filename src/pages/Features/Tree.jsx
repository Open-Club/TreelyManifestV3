import React, { useState } from "react";
import { Tree } from "antd";
import dummyData from "./util/fakeData";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner, faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';


const antdTree = () => {
  const { TreeNode } = Tree;
  const [treeInfo, setTreeInfo] = useState(dummyData)

  //setTreeInfo(dummyData);

  const loop = (data, depth) => data.map((item) => {
    let render;
    const width = 220
    const maxWidth = String((width) - (depth) * 16) + "px";

    let icon = <img border="0" src={[chrome.runtime.getURL("icon-blank.png")]} style={{ width: "16px", height: "16px" }} />;


    var title = (
      <span>
        <span className="ant-tree-title-left">
          {item.status == "loading" ? item.url.includes("") ? "New Tab" : item.url : item.title}
          {/*soundIcon*/}
          {/*endIcon*/}

        </span>
        <span className="ant-tree-title-right">
          <div></div>
          <div></div>
          <div></div>
        </span>
      </span>


    );
    if (item.children && item.children.length > 0) {
      const newDepth = depth + 1;
      render = <TreeNode {...item} icon={icon} key={item.key} title={title}>{loop(item.children, newDepth)}</TreeNode>;

    } else {
      render = <TreeNode {...item} icon={icon} key={item.key} title={title}></TreeNode>;
    }
    return render;
  });



  const styles = {
    treeOuterWrapper: {

    }
  }
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
        >
          {loop(treeInfo.treeData, 0)}

        </Tree>
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
