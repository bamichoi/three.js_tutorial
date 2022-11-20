import * as THREE from "../build/three.module.js";
import { OrbitControls } from "./OrbitControls.js";

class App {
	constructor() {
		const divContainer = document.querySelector("#webgl-container");
		this._divContainer = divContainer;

		const renderer = new THREE.WebGLRenderer({ antialias: true }); // 렌더러 생성. antialias true 주면 윤곽 계단현 상 감소
		renderer.setPixelRatio(window.devicePixelRatio); // 현재 디바이스의 pixcelratio를 렌더러에 세팅
		divContainer.appendChild(renderer.domElement); // 렌더러를 div에 dom객체로 추가
		this._renderer = renderer;

		const scene = new THREE.Scene(); // 씬 생성
		this._scene = scene;

		this._setupCamera();
		this._setupLight();
		this._setupModel();
		this._setupControls();

		window.onresize = this.resize.bind(this);
		this.resize(); // 인스턴스 생성시 바로 resize 메서드 한번 실행해줌.

		requestAnimationFrame(this.render.bind(this));
		// 렌더 메서드는 3차원 장면을 만들어주는 메서드. requestAnimationFrame API는 렌더 메서드와 함께 호출되면서 적당한 시점에 가장 빠르게 렌더링해줌.
	}

	_setupControls() {
		new OrbitControls(this._camera, this._divContainer); // OrbitControls 카메라 객체와 마우스 이벤트를 받는 dom요소 필요
	}

	_setupCamera() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
		camera.position.z = 2;
		this._camera = camera;
	}

	_setupLight() {
		const color = 0xffffff;
		const intensity = 1;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4);
		this._scene.add(light); // scene 객체의 구성요소로 추가
	}

	_setupModel() {
		const geometry = new THREE.CircleGeometry(0.9, 16, Math.PI / 2, Math.PI); // 반지름, 세그먼트, 시작각도, 연장각도
		const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 }); // 회색
		const cube = new THREE.Mesh(geometry, fillMaterial); // 회색 원판의 메쉬타입 오브젝트 생성

		const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 }); // 노란색 윤곽선 마테리얼 오브젝트
		const line = new THREE.LineSegments(
			new THREE.WireframeGeometry(geometry),
			lineMaterial
		); // 정육면체 지오메트리를 와이어프레임형태로 지오메트리 표현한 오브젝트오ㅘ 노란색 라인 마테리얼 오브젝트로 라인타입 오브젝트 생성

		const group = new THREE.Group(); // 메쉬 오브젝트와 라인오브젝트를 하나의 오브젝트로 다룸
		group.add(cube);
		group.add(line);

		this._scene.add(group); // 씬 객체에 큐브를 추가
		this._cube = group;
	}

	resize() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;

		// 현재 width, height 를 가져와서 camera의 속성값 설정
		this._camera.aspect = width / height;
		this._camera.updateProjectionMatrix();

		// 렌더러 크기 설정
		this._renderer.setSize(width, height);
	}

	// time은 렌더링 시작 후의 시간 값(ms) requestAnimationFrame 함수가 render에 전달해주게 됨
	render(time) {
		this._renderer.render(this._scene, this._camera); // 카메라의 시점으로 씬을 렌더링시킴
		this.update(time); // 시간이 지남에 따라 update 메서드에서 원하는 효과 발생시킴
		requestAnimationFrame(this.render.bind(this)); // 렌더메서드가 반복해서 무한히 호출됨
	}

	update(time) {
		time *= 0.001; // ms 변환
		// this._cube.rotation.x = time;
	}
}

window.onload = function () {
	new App();
};
