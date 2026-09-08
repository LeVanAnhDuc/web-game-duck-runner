import {
  LANE_CENTER, LANE_WIDTH_M, OBSTACLE_BLOCK_H_M, OBSTACLE_HALF_D_M,
  OBSTACLE_HIGH_CLEAR_M, OBSTACLE_HIGH_H_M, OBSTACLE_LOW_H_M,
} from './constants'
import type { Aabb, Obstacle, ObstacleKind } from './types'

/** Hop bao cua mot chuong ngai. z=0 la vi tri nhan vat. */
export function obstacleAabb(o: Obstacle): Aabb {
  const cx = (o.lane - LANE_CENTER) * LANE_WIDTH_M
  const halfW = LANE_WIDTH_M * 0.42
  switch (o.kind) {
    case 'low':
      return { cx, cy: OBSTACLE_LOW_H_M / 2, halfW, halfH: OBSTACLE_LOW_H_M / 2, cz: o.z, halfD: OBSTACLE_HALF_D_M }
    case 'high':
      return {
        cx,
        cy: OBSTACLE_HIGH_CLEAR_M + OBSTACLE_HIGH_H_M / 2,
        halfW,
        halfH: OBSTACLE_HIGH_H_M / 2,
        cz: o.z,
        halfD: OBSTACLE_HALF_D_M,
      }
    case 'block':
      return { cx, cy: OBSTACLE_BLOCK_H_M / 2, halfW, halfH: OBSTACLE_BLOCK_H_M / 2, cz: o.z, halfD: OBSTACLE_HALF_D_M }
  }
}

export function overlaps(a: Aabb, b: Aabb): boolean {
  return (
    Math.abs(a.cx - b.cx) < a.halfW + b.halfW &&
    Math.abs(a.cy - b.cy) < a.halfH + b.halfH &&
    Math.abs(a.cz - b.cz) < a.halfD + b.halfD
  )
}

/** Chieu cao trong cua mot loai chuong ngai — dung boi solver. */
export function clearance(kind: ObstacleKind): { minY: number; maxY: number } {
  switch (kind) {
    case 'low':
      return { minY: OBSTACLE_LOW_H_M, maxY: Infinity }
    case 'high':
      return { minY: 0, maxY: OBSTACLE_HIGH_CLEAR_M }
    case 'block':
      return { minY: Infinity, maxY: Infinity }
  }
}
