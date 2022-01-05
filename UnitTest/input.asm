;fn addition(int x,int y){
;    x=x+y
;   return x;
;}

addition:
; init x with 1
mov 0x1,FP,[0x1]
; init y with 2
mov 0x2,FP,[0x2]

; assign x value to register R1
mov FP,[0x1],R1
; assign y value to register R2
mov FP,[0x2],R2
;x+y
add R1,R2
;x=x+y
mov ACC,R1
mov R1,FP,[0x1]
mov  FP,[0x1],DATA

ret