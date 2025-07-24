@@ .. @@
 import { useFrameworkReady } from '@/hooks/useFrameworkReady';
 import { ThemeProvider } from '@/contexts/ThemeContext';
+import { AppProvider } from '@/contexts/AppContext';
 
 export default function RootLayout() {
   useFrameworkReady();
 
   return (
     <ThemeProvider>
-      <>
-        <Stack screenOptions={{ headerShown: false }}>
-          <Stack.Screen name="+not-found" />
-        </Stack>
-        <StatusBar style="auto" />
-      </>
+      <AppProvider>
+        <>
+          <Stack screenOptions={{ headerShown: false }}>
+            <Stack.Screen name="+not-found" />
+          </Stack>
+          <StatusBar style="auto" />
+        </>
+      </AppProvider>
     </ThemeProvider>
   );
 }