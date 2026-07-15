import { useEffect, useRef, useState } from 'react'

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `
precision mediump float;
uniform float u_time;
uniform vec2 u_res;
uniform float u_burst;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float t = u_time;

  // film grain centered on mid-gray: overlay blend treats 0.5 as neutral
  float g = hash(gl_FragCoord.xy + vec2(t * 61.7, t * 83.3));
  vec3 col = vec3(mix(0.5, g, 0.22));

  // scanlines with slow vertical drift
  col -= sin((gl_FragCoord.y + t * 18.0) * 1.6) * 0.02;

  // burst: horizontal tear bands with RGB-offset edges + brightness flicker
  if (u_burst > 0.0) {
    float band = floor(uv.y * 24.0 + t * 40.0);
    float r = hash(vec2(band, floor(t * 20.0)));
    if (r > 0.8) {
      float edge = fract(uv.y * 24.0);
      col.r += 0.25 * u_burst;
      col.b += 0.20 * u_burst * step(0.85, edge);
      col.g -= 0.10 * u_burst * step(edge, 0.15);
    }
    col += (hash(vec2(floor(t * 30.0), 7.0)) - 0.5) * 0.08 * u_burst;
  }

  gl_FragColor = vec4(col, 0.85);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type)
  if (!sh) throw new Error('createShader failed')
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(sh) ?? 'shader compile failed')
  }
  return sh
}

export default function GlitchCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let cleanupGl = () => {}

    const init = (): boolean => {
      const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false })
      if (!gl) return false
      let program: WebGLProgram | null = null
      let vs: WebGLShader | null = null
      let fs: WebGLShader | null = null
      try {
        program = gl.createProgram()
        if (!program) return false
        vs = compile(gl, gl.VERTEX_SHADER, VERT)
        fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
        gl.attachShader(program, vs)
        gl.attachShader(program, fs)
        gl.linkProgram(program)
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false
      } catch {
        return false
      }
      gl.useProgram(program)
      const buf = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
      const aPos = gl.getAttribLocation(program, 'a_pos')
      gl.enableVertexAttribArray(aPos)
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
      const uTime = gl.getUniformLocation(program, 'u_time')
      const uRes = gl.getUniformLocation(program, 'u_res')
      const uBurst = gl.getUniformLocation(program, 'u_burst')

      const resize = () => {
        // DPR intentionally 1: grain needs no retina, 4x less fill
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        gl.viewport(0, 0, canvas.width, canvas.height)
      }
      resize()
      window.addEventListener('resize', resize)

      let burstUntil = 0
      let nextBurst = performance.now() + 4000 + Math.random() * 5000

      const draw = (now: number) => {
        if (now >= nextBurst) {
          burstUntil = now + 150 + Math.random() * 250
          nextBurst = now + 4000 + Math.random() * 5000
        }
        gl.uniform1f(uTime, now / 1000)
        gl.uniform2f(uRes, canvas.width, canvas.height)
        gl.uniform1f(uBurst, !reduced && now < burstUntil ? 1 : 0)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
        if (!reduced && !document.hidden) raf = requestAnimationFrame(draw)
      }
      raf = requestAnimationFrame(draw)

      const onVisibility = () => {
        cancelAnimationFrame(raf)
        if (!document.hidden) raf = requestAnimationFrame(draw)
      }
      document.addEventListener('visibilitychange', onVisibility)

      cleanupGl = () => {
        window.removeEventListener('resize', resize)
        document.removeEventListener('visibilitychange', onVisibility)
        cancelAnimationFrame(raf)
        gl.deleteBuffer(buf)
        gl.deleteProgram(program)
        gl.deleteShader(vs)
        gl.deleteShader(fs)
      }
      return true
    }

    const onLost = (e: Event) => {
      e.preventDefault()
      cancelAnimationFrame(raf)
    }
    const onRestored = () => {
      cleanupGl()
      if (!init()) setFallback(true) // one silent restore attempt
    }
    canvas.addEventListener('webglcontextlost', onLost)
    canvas.addEventListener('webglcontextrestored', onRestored)

    if (!init()) setFallback(true)

    return () => {
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      cleanupGl()
    }
  }, [])

  if (fallback) {
    return (
      <div
        data-testid="grain-fallback"
        aria-hidden
        className="grain-static pointer-events-none fixed inset-0 z-[100] mix-blend-overlay"
      />
    )
  }
  return (
    <canvas
      ref={ref}
      data-testid="grain-canvas"
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] mix-blend-overlay"
    />
  )
}
