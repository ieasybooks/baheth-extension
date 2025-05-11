import prettyMilliseconds from 'pretty-ms'
import { throttle } from 'throttle-debounce'

export function render_transcription_view(transcription: unknown[]) {
    let transcription_view = document.createElement('div')
    transcription_view.classList.add('baheth-transcription-view')

    let transcription_view_header = document.createElement('div')
    transcription_view_header.classList.add('baheth-transcription-view-header')
    transcription_view_header.innerHTML = `
        <h6>باحث</h6>
    `
    transcription_view.appendChild(transcription_view_header)

    let transcription_view_content = document.createElement('div')
    transcription_view_content.classList.add('baheth-transcription-view-content')
    transcription_view.appendChild(transcription_view_content)

    let __transcription_items: HTMLDivElement[] = []

    for (let i = 0; i < transcription.length; i++) {
        let transcription_item_data = transcription[i] as any;
        let pretty_start_time = prettyMilliseconds(transcription_item_data.start_time * 1000, {
            colonNotation: true,
        })

        let transcription_item = document.createElement('div')
        transcription_item.classList.add('baheth-transcription-item')
        transcription_item.innerHTML = `
            <p>
                <span class="baheth-transcription-item-time">${pretty_start_time}</span>
                ${transcription_item_data.content}
            </p>
        `

        transcription_view_content.appendChild(transcription_item)
        __transcription_items.push(transcription_item)
    }

    let yt_secondary_panel = document.querySelector("#columns #secondary #panels")?.parentElement
    yt_secondary_panel?.prepend(transcription_view)

    setTimeout(() => {
        const yt = document.querySelector('ytd-page-manager ytd-watch-flexy .html5-video-player video')

        yt?.addEventListener('timeupdate', throttle(1500, (ev) => {
            let time = (ev.target as HTMLVideoElement).currentTime

            let item_index = transcription.findIndex((t: any) => t.start_time <= time && t.end_time >= time);
            let item = __transcription_items[item_index];

            transcription_view_content.scrollTo({
                top: item.offsetTop - transcription_view_content.offsetTop,
                behavior: "smooth"
            })
        }))
    }, 0);
}

export function delete_all_transcription_view() {
    let views = document.querySelectorAll('.baheth-transcription-view')

    for (const view of views) {
        view?.remove()
    }
}