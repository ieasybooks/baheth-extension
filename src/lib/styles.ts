export function init_styles() {
  const style = document.createElement("style");
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic&display=swap');

    .baseth-toast,
    .baheth-toast *{
        font-family: 'Noto Naskh Arabic', sans-serif !important;
        font-optical-sizing: auto !important;
        font-weight: inherit !important;
    }
    .baheth-toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 6px 12px;
        font-size: 16px !important;
        background-color: rgb(255 255 255);
        border-radius: 6px;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 2px 5px;
        z-index: 10000;
        direction: rtl;
        display: flex;
        align-items: right;
        justify-content: space-between;
        flex-wrap: wrap;
        flex-direction: column;
        gap: 0px;
        max-width: 100vw;
        cursor: pointer;
        transition:  0.25s linear;
        transition-property: transform, opacity;
        user-select: none;
        transform: translateY(10px);
        opacity: 0;
        pointer-events: none;
    }
    .baheth-toast.show {
        transform: translateY(0px);
        opacity: 1;
        pointer-events: all;
    }
    .baheth-toast:hover {
        box-shadow: rgba(8, 4, 4, 0.5) 0px 4px 10px;
        transition-duration: .1s;
    }
    .baheth-toast:active {
        transform: scale(0.98);
    }
    .baheth-toast .toast-title {
        font-weight: 600 !important;
        font-size: 18px;
        margin: 0;
        padding: 0;
    }
    .baheth-toast .toast-description {
        font-weight: 400 !important;
        font-size: 16px;
        color: rgb(64, 64, 64);
        margin: 0;
        padding: 0;
    }

    .baheth-toast button {
        padding: 8px 16px;
        border-radius: 6px;
        background-color: rgb(244,244,244);
        display: block;
        text-align: center;
        border: 1px solid rgb(220,220,220);
        outline: none;
        cursor: pointer;
        font-size: 14px;
        color: black;
    }

    .baheth-toast .close {
        pointer-events: none;
        opacity: 0;
        position: absolute;
        top: 10px;
        left: 10px;
        cursor: pointer;
        transition: all 0.1s linear;
        box-shadow: 0px 0px 0px 1.6px rgba(228,228,228,1);
    }

    .baheth-toast:hover .close {
        display: block;
        pointer-events: all;
        opacity: 1;
    }    
`;

  document.head.appendChild(style);
}
