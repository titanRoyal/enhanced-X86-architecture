mov sp,CBP
; init x with 1
mov 0x1,CBP,[0x1]
; init y with 2
mov 0xff,CBP,[0x3]
psh BP
mov CBP,BP
cal &[!addition]
pop BP
hlt

addition:
mov sp,CBP

mov BP,[0x1],R1
; assign y value to register R2
mov BP,[0x3],R2
;x+y
add R1,R2
;x=x+y
mov ACC,R1
mov R1,BP,[0x1]

mov  BP,[0x1],DATA

mov 0xa,CBP,[0x1]
; init y with 2
mov 0x5,CBP,[0x2]
psh BP
mov CBP,BP
cal &[!other]
pop BP
mov BP,[0x1],R8

ret

other:
mov sp,CBP

mov BP,[0x1],R1
; assign y value to register R2
mov BP,[0x2],R2
;x+y
add R1,R2
;x=x+y
mov ACC,R1
mov R1,BP,[0x1]

mov  BP,[0x1],DATA

ret