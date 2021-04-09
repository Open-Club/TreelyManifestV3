const TreeStyle = () => {
  return (
    `
        @-webkit-keyframes antCheckboxEffect {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
        @keyframes antCheckboxEffect {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
        .ant-tree-treenode-leaf-last .ant-tree-switcher-leaf-line::before {
          top: auto !important;
          bottom: auto !important;
          height: 14px !important;
        }
        .ant-tree.ant-tree-directory .ant-tree-treenode {
          position: relative;
        }
        .ant-tree.ant-tree-directory .ant-tree-treenode::before {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 4px;
          left: 0;
          transition: background-color 0.3s;
          content: '';
          pointer-events: none;
        }
        .ant-tree.ant-tree-directory .ant-tree-treenode:hover::before {
          background: #f5f5f5;
        }
        .ant-tree.ant-tree-directory .ant-tree-treenode > * {
          z-index: 1;
        }
        .ant-tree.ant-tree-directory .ant-tree-treenode .ant-tree-switcher {
          transition: color 0.3s;
        }
        .ant-tree.ant-tree-directory .ant-tree-treenode .ant-tree-node-content-wrapper {
          border-radius: 0;
          -webkit-user-select: none;
            -moz-user-select: none;
              -ms-user-select: none;
                  user-select: none;
        }
        .ant-tree.ant-tree-directory .ant-tree-treenode .ant-tree-node-content-wrapper:hover {
          background: transparent;
        }
        .ant-tree.ant-tree-directory .ant-tree-treenode .ant-tree-node-content-wrapper.ant-tree-node-selected {
          color: #fff;
          background: transparent;
        }
        .ant-tree.ant-tree-directory .ant-tree-treenode-selected:hover::before,
        .ant-tree.ant-tree-directory .ant-tree-treenode-selected::before {
          background: #1890ff;
        }
        .ant-tree.ant-tree-directory .ant-tree-treenode-selected .ant-tree-switcher {
          color: #fff;
        }
        .ant-tree.ant-tree-directory .ant-tree-treenode-selected .ant-tree-node-content-wrapper {
          color: #fff;
          background: transparent;
        }
        .ant-tree-checkbox {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          color: rgba(0, 0, 0, 0.85);
          font-size: 14px;
          font-variant: tabular-nums;
          line-height: 1.5715;
          list-style: none;
          font-feature-settings: 'tnum';
          position: relative;
          top: 0.2em;
          line-height: 1;
          white-space: nowrap;
          outline: none;
          cursor: pointer;
        }
        .ant-tree-checkbox-wrapper:hover .ant-tree-checkbox-inner,
        .ant-tree-checkbox:hover .ant-tree-checkbox-inner,
        .ant-tree-checkbox-input:focus + .ant-tree-checkbox-inner {
          border-color: #1890ff;
        }
        .ant-tree-checkbox-checked::after {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 1px solid #1890ff;
          border-radius: 2px;
          visibility: hidden;
          -webkit-animation: antCheckboxEffect 0.36s ease-in-out;
                  animation: antCheckboxEffect 0.36s ease-in-out;
          -webkit-animation-fill-mode: backwards;
                  animation-fill-mode: backwards;
          content: '';
        }
        .ant-tree-checkbox:hover::after,
        .ant-tree-checkbox-wrapper:hover .ant-tree-checkbox::after {
          visibility: visible;
        }
        .ant-tree-checkbox-inner {
          position: relative;
          top: 0;
          left: 0;
          display: block;
          width: 16px;
          height: 16px;
          direction: ltr;
          background-color: #fff;
          border: 1px solid #d9d9d9;
          border-radius: 2px;
          border-collapse: separate;
          transition: all 0.3s;
        }
        .ant-tree-checkbox-inner::after {
          position: absolute;
          top: 50%;
          left: 22%;
          display: table;
          width: 5.71428571px;
          height: 9.14285714px;
          border: 2px solid #fff;
          border-top: 0;
          border-left: 0;
          transform: rotate(45deg) scale(0) translate(-50%, -50%);
          opacity: 0;
          transition: all 0.1s cubic-bezier(0.71, -0.46, 0.88, 0.6), opacity 0.1s;
          content: ' ';
        }
        .ant-tree-checkbox-input {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 1;
          width: 100%;
          height: 100%;
          cursor: pointer;
          opacity: 0;
        }
        .ant-tree-checkbox-checked .ant-tree-checkbox-inner::after {
          position: absolute;
          display: table;
          border: 2px solid #fff;
          border-top: 0;
          border-left: 0;
          transform: rotate(45deg) scale(1) translate(-50%, -50%);
          opacity: 1;
          transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
          content: ' ';
        }
        .ant-tree-checkbox-checked .ant-tree-checkbox-inner {
          background-color: #1890ff;
          border-color: #1890ff;
        }
        .ant-tree-checkbox-disabled {
          cursor: not-allowed;
        }
        .ant-tree-checkbox-disabled.ant-tree-checkbox-checked .ant-tree-checkbox-inner::after {
          border-color: rgba(0, 0, 0, 0.25);
          -webkit-animation-name: none;
                  animation-name: none;
        }
        .ant-tree-checkbox-disabled .ant-tree-checkbox-input {
          cursor: not-allowed;
        }
        .ant-tree-checkbox-disabled .ant-tree-checkbox-inner {
          background-color: #f5f5f5;
          border-color: #d9d9d9 !important;
        }
        .ant-tree-checkbox-disabled .ant-tree-checkbox-inner::after {
          border-color: #f5f5f5;
          border-collapse: separate;
          -webkit-animation-name: none;
                  animation-name: none;
        }
        .ant-tree-checkbox-disabled + span {
          color: rgba(0, 0, 0, 0.25);
          cursor: not-allowed;
        }
        .ant-tree-checkbox-disabled:hover::after,
        .ant-tree-checkbox-wrapper:hover .ant-tree-checkbox-disabled::after {
          visibility: hidden;
        }
        .ant-tree-checkbox-wrapper {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          color: rgba(0, 0, 0, 0.85);
          font-size: 14px;
          font-variant: tabular-nums;
          line-height: 1.5715;
          list-style: none;
          font-feature-settings: 'tnum';
          display: inline-flex;
          align-items: baseline;
          line-height: unset;
          cursor: pointer;
        }
        .ant-tree-checkbox-wrapper.ant-tree-checkbox-wrapper-disabled {
          cursor: not-allowed;
        }
        .ant-tree-checkbox-wrapper + .ant-tree-checkbox-wrapper {
          margin-left: 8px;
        }
        .ant-tree-checkbox + span {
          padding-right: 8px;
          padding-left: 8px;
        }
        .ant-tree-checkbox-group {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          color: rgba(0, 0, 0, 0.85);
          font-size: 14px;
          font-variant: tabular-nums;
          line-height: 1.5715;
          list-style: none;
          font-feature-settings: 'tnum';
          display: inline-block;
        }
        .ant-tree-checkbox-group-item {
          margin-right: 8px;
        }
        .ant-tree-checkbox-group-item:last-child {
          margin-right: 0;
        }
        .ant-tree-checkbox-group-item + .ant-tree-checkbox-group-item {
          margin-left: 0;
        }
        .ant-tree-checkbox-indeterminate .ant-tree-checkbox-inner {
          background-color: #fff;
          border-color: #d9d9d9;
        }
        .ant-tree-checkbox-indeterminate .ant-tree-checkbox-inner::after {
          top: 50%;
          left: 50%;
          width: 8px;
          height: 8px;
          background-color: #1890ff;
          border: 0;
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
          content: ' ';
        }
        .ant-tree-checkbox-indeterminate.ant-tree-checkbox-disabled .ant-tree-checkbox-inner::after {
          background-color: rgba(0, 0, 0, 0.25);
          border-color: rgba(0, 0, 0, 0.25);
        }
        .ant-tree {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          color: rgba(0, 0, 0, 0.85);
          font-size: 14px;
          font-variant: tabular-nums;
          line-height: 1.5715;
          list-style: none;
          font-feature-settings: 'tnum';
          background: #fff;
          border-radius: 2px;
          transition: background-color 0.3s;
        }
        .ant-tree-focused:not(:hover):not(.ant-tree-active-focused) {
          background: #e6f7ff;
        }
        .ant-tree-list-holder-inner {
          align-items: flex-start;
        }
        .ant-tree.ant-tree-block-node .ant-tree-list-holder-inner {
          align-items: stretch;
        }
        .ant-tree.ant-tree-block-node .ant-tree-list-holder-inner .ant-tree-node-content-wrapper {
          flex: auto;
        }
        .ant-tree .ant-tree-treenode {
          display: flex;
          align-items: flex-start;
          padding: 0 10px 4px 5px;
          outline: none;
        }
        .ant-tree .ant-tree-treenode-disabled .ant-tree-node-content-wrapper {
          color: rgba(0, 0, 0, 0.25);
          cursor: not-allowed;
        }
        .ant-tree .ant-tree-treenode-disabled .ant-tree-node-content-wrapper:hover {
          background: transparent;
        }
        .ant-tree .ant-tree-treenode-active .ant-tree-node-content-wrapper {
          background: #f5f5f5;
        }
        .ant-tree .ant-tree-treenode:not(.ant-tree .ant-tree-treenode-disabled).filter-node .ant-tree-title {
          color: inherit;
          font-weight: 500;
        }
        .ant-tree-indent {
          align-self: stretch;
          white-space: nowrap;
          -webkit-user-select: none;
            -moz-user-select: none;
              -ms-user-select: none;
                  user-select: none;
        }
        .ant-tree-indent-unit {
          display: inline-block;
          width: 24px;
        }
        .ant-tree-switcher {
          position: relative;
          flex: none;
          align-self: stretch;
          width: 12px;
          height: 20px;
          display: table;
          margin: 0;
          line-height: 24px;
          text-align: center;
          cursor: pointer;
          -webkit-user-select: none;
            -moz-user-select: none;
              -ms-user-select: none;
                  user-select: none;
        }
        .ant-tree-switcher .ant-tree-switcher-icon,
        .ant-tree-switcher .ant-select-tree-switcher-icon {
          display: table-cell;
          font-size: 10px;
          vertical-align: bottom;
        }
        .ant-tree-switcher .ant-tree-switcher-icon svg,
        .ant-tree-switcher .ant-select-tree-switcher-icon svg {
          transition: transform 0.3s;
        }
        .ant-tree-switcher-noop {
          cursor: default;
        }
        .ant-tree-switcher_close .ant-tree-switcher-icon svg {
          transform: rotate(-90deg);
        }
        .ant-tree-switcher-loading-icon {
          color: #1890ff;
        }
        .ant-tree-switcher-leaf-line {
          position: relative;
          z-index: 1;
          display: inline-block;
          width: 100%;
          height: 100%;
        }
        .ant-tree-switcher-leaf-line::before {
          position: absolute;
          top: 0;
          bottom: -4px;
          margin-left: -1px;
          border-left: 1px solid #d9d9d9;
          content: ' ';
        }
        .ant-tree-switcher-leaf-line::after {
          position: absolute;
          width: 10px;
          height: 14px;
          margin-left: -1px;
          border-bottom: 1px solid #d9d9d9;
          content: ' ';
        }
        .ant-tree-checkbox {
          top: initial;
          margin: 4px 8px 0 0;
        }
        .ant-tree .ant-tree-node-content-wrapper {
          position: relative;
          z-index: auto;
          min-height: 24px;
          margin: 0;
          padding: 4px 10px 4px 10px;
          color: inherit;
          line-height: 24px;
          background: transparent;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.3s, border 0s, line-height 0s, box-shadow 0s;
          display: inline-block;
          width: 100;
        }
        .ant-tree .ant-tree-node-content-wrapper:hover {
          background-color: #f5f5f5;
        }
        .ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected {
          background-color: #bae7ff;
        }
        .ant-tree .ant-tree-node-content-wrapper .ant-tree-iconEle {
          display: none;

        }

        .ant-tree-title-icon:hover {
          color: rgba(41,47,61,.75);
          background: rgba(41,47,61,.07);
        }



        .ant-tree .ant-tree-node-content-wrapper .ant-tree-iconEle:empty {
          display: none;
        }
        .ant-tree-unselectable .ant-tree-node-content-wrapper:hover {
          background-color: transparent;
        }
        .ant-tree-node-content-wrapper[draggable='true'] {
          line-height: 24px;
          -webkit-user-select: none;
            -moz-user-select: none;
              -ms-user-select: none;
                  user-select: none;
        }
        .ant-tree-node-content-wrapper[draggable='true'] .ant-tree-drop-indicator {
          position: absolute;
          z-index: 1;
          height: 2px;
          background-color: #1890ff;
          border-radius: 1px;
          pointer-events: none;
        }
        .ant-tree-node-content-wrapper[draggable='true'] .ant-tree-drop-indicator::after {
          position: absolute;
          top: -3px;
          left: -6px;
          width: 8px;
          height: 8px;
          background-color: transparent;
          border: 2px solid #1890ff;
          border-radius: 50%;
          content: '';
        }
        .ant-tree .ant-tree-treenode.drop-container > [draggable] {
          box-shadow: 0 0 0 2px #1890ff;
        }
        .ant-tree-show-line .ant-tree-indent-unit {
          position: relative;
          height: 100%;
        }
        .ant-tree-show-line .ant-tree-indent-unit::before {
          position: absolute;
          top: 0;
          right: 12px;
          bottom: -4px;
          border-right: 1px solid #d9d9d9;
          content: '';
        }
        .ant-tree-show-line .ant-tree-indent-unit-end::before {
          display: none;
        }
        .ant-tree-show-line .ant-tree-switcher {
          background: #fff;
        }
        .ant-tree-show-line .ant-tree-switcher-line-icon {
          vertical-align: -0.225em;
        }
        .ant-tree-rtl {
          direction: rtl;
        }
        .ant-tree-rtl .ant-tree-node-content-wrapper[draggable='true'] .ant-tree-drop-indicator::after {
          right: -6px;
          left: unset;
        }
        .ant-tree .ant-tree-treenode-rtl {
          direction: rtl;
        }
        .ant-tree-rtl .ant-tree-switcher_close .ant-tree-switcher-icon svg {
          transform: rotate(90deg);
        }
        .ant-tree-rtl.ant-tree-show-line .ant-tree-indent-unit::before {
          right: auto;
          left: -13px;
          border-right: none;
          border-left: 1px solid #d9d9d9;
        }
        .ant-tree-rtl.ant-tree-checkbox {
          margin: 4px 0 0 8px;
        }
        .ant-tree-select-dropdown-rtl .ant-select-tree-checkbox {
          margin: 4px 0 0 8px;
        }

    `
  )
}

export default TreeStyle;
