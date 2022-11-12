import * as THREE from "../build/three.module.js";

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

		window.onresize = this.resize.bind(this);
		this.resize(); // 인스턴스 생성시 바로 resize 메서드 한번 실행해줌.

		requestAnimationFrame(this.render.bind(this));
		// 렌더 메서드는 3차원 장면을 만들어주는 메서드. requestAnimationFrame API는 렌더 메서드와 함께 호출되면서 적당한 시점에 가장 빠르게 렌더링해줌.
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

	// 파란색 정육면체 메쉬 생성
	_setupModel() {
		const geometry = new THREE.BoxGeometry(1, 1, 1); // 가로, 세로, 깊이 값으로 정육면체 생성
		const material = new THREE.MeshPhongMaterial({ color: 0x44a88 }); // 파란색 계열의 재질

		const cube = new THREE.Mesh(geometry, material); // geometry와 material로 메쉬 생성

		this._scene.add(cube); // 씬 객체에 큐브를 추가
		this._cube = cube;
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
		this._cube.rotation.x = time; // 큐브의 x,y축의 회전 값을 time으로 넣어 큐브를 계속 돌게함
		this._cube.rotation.y = time;
	}
}

window.onload = function () {
	new App();
};
