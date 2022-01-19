import "./App.css";
import "./main.css";

import * as THREE from "three";

import {OrbitControls} from "./OrbitControls.js";
import {PCDLoader} from "./PCDLoader.js";
import {useEffect, useState} from "react";

let renderer, scene, camera, controls, points;

function App() {
    const [filename, setFilename] = useState("");

    useEffect(() => {
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 500);
        camera.position.set(0, 0, 200);
        scene.add(camera);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.addEventListener("change", (e) => {
            console.log(e);
            render();
        }); // use if there is no animation loop
        controls.minDistance = 0.01;
        controls.maxDistance = 500;

        //scene.add( new THREE.AxesHelper( 1 ) );

        window.addEventListener("resize", onWindowResize);
        window.addEventListener("keypress", keyboard);
    }, []);

    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const render = () => {
        renderer.render(scene, camera);
    };

    const onFileSelect = (e) => {
        console.log(e.target.files);

        const reader = new FileReader();
        reader.onload = function () {
            console.log(this.result);
            console.log(e.target.files[0].name);
            console.log(scene);
            const loader = new PCDLoader();
            points = loader.parse(this.result, e.target.files[0].name);
            console.log(points);
            setFilename(e.target.files[0].name);

            points.geometry.center();
            points.geometry.rotateZ(Math.PI / 2);
            points.material.color.setHex(0xffffff);
            points.material.size = 0.8;
            scene.add(points);

            render();
        };
        reader.readAsArrayBuffer(e.target.files[0]);
    };

    const keyboard = (ev) => {
        // const points = scene.getObjectByName(filename);

        switch (ev.key || String.fromCharCode(ev.keyCode || ev.charCode)) {
            case "+":
                points.material.size *= 1.2;
                console.log(points.material.size);
                break;
            case "-":
                points.material.size /= 1.2;
                console.log(points.material.size);
                break;
            case "c":
                points.material.color.setHex(Math.random() * 0xffffff);
                break;
            default:
                break;
        }
        render();
    };

    return (<div className="App">
        <div id="info">
            <a href="https://pointclouds.org/documentation/tutorials/pcd_file_format.html" target="_blank"
               rel="noopener noreferrer">PCD File format</a>
            <input type="file" onChange={onFileSelect} style={{margin: "0 1rem"}}/>
            <button style={{margin: "0 1rem", display: "inline-block"}}
                    onClick={() => alert("Author: Tang Yun -- ntutangyun [at] gmail [dot] com. \n\nI'm currently working on safety testing of Autonomous vehicles. Collaborations are welcome :)\n\nBuilt from Three.js examples.")}>
                Author
            </button>
            <div>+/-: Increase/Decrease point size</div>
            <div>c: Change color</div>
        </div>
    </div>);
}

export default App;
