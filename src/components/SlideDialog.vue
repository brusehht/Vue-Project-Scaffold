<template>
  <transition :name="animation">
    <div :class="setDialogClass" v-show="visible" v-clickoutside="handleClose" v-drag:dialog-head.y="onVDrag">
      <div ref="head" class="dialog-head" v-if="header">
        <div class="title">{{title}}</div>
        <i class="el-icon-close" @click="cancel"></i>
      </div>
      <div ref="head" class="dialog-head" v-else>
        <slot name="header"></slot>
      </div>
      <div ref="content" class="dialog-content">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from '@/config/base.imports';

import Clickoutside from 'element-ui/src/utils/clickoutside';

type slideAnimation = 'move-right' | 'move-left' | 'move-bottom';

@Component({
	name: 'SlideDialog',
	directives: {
		Clickoutside,
	},
})
export default class SlideDialog extends Vue {
	//动画(move-right,move-left,move-bottom)
	@Prop({ default: 'move-right' })
	animation: slideAnimation;
	//是否需要头部栏
	@Prop({ default: true })
	header: boolean = true;
	//弹出框距离顶部高度(px或者百分比)
	@Prop() top: string;
	//弹出框宽度(px或者百分比)
	@Prop() width: string;
	//弹出框高度(px或者百分比)
	@Prop() height: string;
	//头部标题
	@Prop({ default: 'Information' })
	title: string;
	//是否显示
	@Prop({ default: false })
	value: boolean = false;

	visible: boolean = this.value;

	get setDialogClass() {
		let cls = '';
		if (this.animation === 'move-right') {
			cls = 'slide-dialog right-dialog';
		} else if (this.animation === 'move-left') {
			cls = 'slide-dialog left-dialog';
		} else if (this.animation === 'move-bottom') {
			cls = 'slide-dialog bottom-dialog';
		} else {
			cls = 'slide-dialog';
		}
		return cls;
	}
	@Watch('value')
	setStyle(val) {
		if (val) {
			this.$el.style.width = this.width;
			this.$el.style.height = this.height;
			this.$el.style.top = this.top;
		}
		this.visible = val;
	}
	onVDrag(this: any, dragStat) {
		this.$refs.content.style.height =
			dragStat.height - this.$refs.head.offsetHeight + 'px';
	}
	cancel() {
		this.visible = false;
	}
	handleClose() {
		this.visible = false;
	}
}
</script>
<style scoped>
/*样式*/
.slide-dialog {
	position: fixed;
	background: #fff;
	bottom: 0;
	z-index: 999;
	box-shadow: 0 10px 23px 2px rgba(0, 0, 0, 0.2), 0 3px 6px rgba(0, 0, 0, 0.15);
}

.dialog-head {
	position: relative;
	width: 100%;
	height: 30px;
	font-size: 20px;
	line-height: 45px;
	border-bottom: 1px solid #ccc;
	background-color: #adb1bd;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.closeSilde {
	margin: 0 10px;
	width: 30px;
	height: 30px;
	background-image: url('data:image/png;base64,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');
	background-size: cover;
	cursor: pointer;
}

.el-icon-close {
	color: #fff;
	font-size: 25px;
	margin: 10px;
	cursor: pointer;
}

.title {
	color: #fff;
	margin-left: 10px;
}

.dialog-content {
	height: 454px;
	overflow-y: auto;
	overflow-x: hidden;
	padding: 5px;
}

.slide-dialog.left-dialog {
	left: 0;
	width: 400px;
	height: 100%;
}

.slide-dialog.right-dialog {
	right: 0;
	width: 400px;
	height: 100%;
}

.slide-dialog.bottom-dialog {
	left: 0;
	right: 0;
	width: 100%;
	height: 500px;
}

/*浏览器滚动条重置*/
.slide-dialog::-webkit-scrollbar {
	width: 5px;
}

.slide-dialog::-webkit-scrollbar-track {
	-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	border-radius: 10px;
}

.slide-dialog::-webkit-scrollbar-thumb {
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}

/*移动端*/
@media (max-width: 768px) {
	.slide-dialog {
		width: 100% !important;
		top: 0 !important;
	}
}

/*动画*/
.move-right-enter-active {
	animation: ivuMoveRightIn 0.5s;
}

.move-right-leave-active {
	animation: ivuMoveRightOut 0.5s;
}

.move-left-enter-active {
	animation: ivuMoveLeftIn 0.5s;
}

.move-left-leave-active {
	animation: ivuMoveLeftOut 0.5s;
}

.move-bottom-enter-active {
	animation: ivuMoveBottomIn 0.5s;
}

.move-bottom-leave-active {
	animation: ivuMoveBottomOut 0.5s;
}

@keyframes ivuMoveRightIn {
	0% {
		opacity: 0;
		transform-origin: 0 0;
		transform: translateX(100%);
	}
	100% {
		opacity: 1;
		transform-origin: 0 0;
		transform: translateX(0%);
	}
}

@keyframes ivuMoveRightOut {
	0% {
		transform-origin: 0 0;
		transform: translateX(0%);
		opacity: 1;
	}
	100% {
		transform-origin: 0 0;
		transform: translateX(100%);
		opacity: 0;
	}
}

@keyframes ivuMoveLeftIn {
	0% {
		transform-origin: 0 0;
		transform: translateX(-100%);
		opacity: 0;
	}
	100% {
		transform-origin: 0 0;
		transform: translateX(0%);
		opacity: 1;
	}
}

@keyframes ivuMoveLeftOut {
	0% {
		transform-origin: 0 0;
		transform: translateX(0%);
		opacity: 1;
	}
	100% {
		transform-origin: 0 0;
		transform: translateX(-100%);
		opacity: 0;
	}
}

@keyframes ivuMoveBottomIn {
	0% {
		transform-origin: 0 0;
		transform: translateY(100%);
		opacity: 0;
	}
	100% {
		transform-origin: 0 0;
		transform: translateY(0%);
		opacity: 1;
	}
}

@keyframes ivuMoveBottomOut {
	0% {
		transform-origin: 0 0;
		transform: translateY(0%);
		opacity: 1;
	}
	100% {
		transform-origin: 0 0;
		transform: translateY(100%);
		opacity: 0;
	}
}
</style>
